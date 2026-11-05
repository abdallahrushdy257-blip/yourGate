<?php

namespace Tests\Feature;

use App\Models\ChartOfAccount;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ChartOfAccountTest extends TestCase
{
    use RefreshDatabase;

    protected Store $storeA;
    protected Store $storeB;
    protected User $userA;
    protected User $userB;

    protected function setUp(): void
    {
        parent::setUp();

        $this->storeA = Store::create([
            'name'   => 'جمعية الأمل',
            'slug'   => 'amal-store',
            'status' => 'active',
        ]);

        $this->storeB = Store::create([
            'name'   => 'جمعية النور',
            'slug'   => 'noor-store',
            'status' => 'active',
        ]);

        $this->userA = User::factory()->create([
            'store_id' => $this->storeA->id,
        ]);

        $this->userB = User::factory()->create([
            'store_id' => $this->storeB->id,
        ]);
    }

    public function test_user_can_retrieve_tree_and_defaults_are_seeded_automatically(): void
    {
        Sanctum::actingAs($this->userA);

        $response = $this->getJson('/api/chartofaccounts');

        $response->assertStatus(200)
            ->assertJsonPath('success', true);

        $data = $response->json('data');
        $this->assertIsArray($data);
        $this->assertNotEmpty($data);

        // Verify root accounts exist (Assets, Liabilities, etc.)
        $codes = collect($data)->pluck('code')->all();
        $this->assertContains('1', $codes);
        $this->assertContains('2', $codes);
        $this->assertContains('3', $codes);
        $this->assertContains('4', $codes);

        // First root account should have nested children
        $assets = collect($data)->firstWhere('code', '1');
        $this->assertNotEmpty($assets['children']);
    }

    public function test_legacy_accounttree_endpoint_returns_direct_array(): void
    {
        Sanctum::actingAs($this->userA);

        $response = $this->getJson('/api/accounttree');

        $response->assertStatus(200);
        $data = $response->json();
        $this->assertIsArray($data);
        $this->assertNotEmpty($data);
        $this->assertEquals('1', $data[0]['code']);
    }

    public function test_chart_of_accounts_is_isolated_between_tenants(): void
    {
        Sanctum::actingAs($this->userA);
        $this->getJson('/api/chartofaccounts');

        // Create a custom account only in Store A
        $parentA = ChartOfAccount::where('store_id', $this->storeA->id)
            ->where('code', '11101') // نقدية وودائع في البنوك
            ->firstOrFail();

        $customA = ChartOfAccount::create([
            'store_id'        => $this->storeA->id,
            'parent_id'       => $parentA->id,
            'code'            => '11101999',
            'name'            => 'حساب بنكي سري للأمل',
            'level'           => $parentA->level + 1,
            'account_type'    => ChartOfAccount::TYPE_ASSET,
            'nature'          => ChartOfAccount::NATURE_DEBIT,
            'is_payable'      => true,
            'is_system'       => false,
            'opening_balance' => 50000,
        ]);

        // User B from Store B accesses their tree
        Sanctum::actingAs($this->userB);
        $responseB = $this->getJson('/api/chartofaccounts/list');

        $responseB->assertStatus(200);
        $codesB = collect($responseB->json('data'))->pluck('code');
        $namesB = collect($responseB->json('data'))->pluck('name');

        $this->assertNotContains('11101999', $codesB);
        $this->assertNotContains('حساب بنكي سري للأمل', $namesB);
    }

    public function test_user_can_create_sub_account_with_auto_generated_code(): void
    {
        Sanctum::actingAs($this->userA);
        $this->getJson('/api/chartofaccounts'); // Seed defaults

        $parent = ChartOfAccount::where('store_id', $this->storeA->id)
            ->where('code', '11101') // نقدية وودائع في البنوك
            ->firstOrFail();

        $payload = [
            'name'            => 'مصرف الإنماء - فرع الرياض',
            'parent_id'       => $parent->id,
            'opening_balance' => 15000,
            'cash_flow_type'  => 1,
            'is_payable'      => true,
        ];

        $response = $this->postJson('/api/chartofaccounts/store', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'مصرف الإنماء - فرع الرياض')
            ->assertJsonPath('data.is_payable', true);

        $newAccount = ChartOfAccount::find($response->json('data.id'));
        $this->assertNotNull($newAccount);
        $this->assertTrue(str_starts_with($newAccount->code, '11101'));
        $this->assertEquals($parent->id, $newAccount->parent_id);
    }

    public function test_user_can_update_account(): void
    {
        Sanctum::actingAs($this->userA);
        $this->getJson('/api/chartofaccounts');

        $parent = ChartOfAccount::where('store_id', $this->storeA->id)
            ->where('code', '11101')
            ->firstOrFail();

        $account = ChartOfAccount::create([
            'store_id'        => $this->storeA->id,
            'parent_id'       => $parent->id,
            'code'            => '11101777',
            'name'            => 'حساب قديم',
            'level'           => $parent->level + 1,
            'account_type'    => ChartOfAccount::TYPE_ASSET,
            'nature'          => ChartOfAccount::NATURE_DEBIT,
            'is_payable'      => true,
            'is_system'       => false,
            'opening_balance' => 1000,
        ]);

        $response = $this->postJson("/api/chartofaccounts/{$account->id}/update", [
            'name'    => 'حساب محدث بالكامل',
            'balance' => 2500,
            'check'   => '1',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.name', 'حساب محدث بالكامل')
            ->assertJsonPath('data.opening_balance', 2500);

        $this->assertEquals('حساب محدث بالكامل', $account->fresh()->name);
        $this->assertEquals(2500, $account->fresh()->opening_balance);
    }

    public function test_cannot_delete_system_account(): void
    {
        Sanctum::actingAs($this->userA);
        $this->getJson('/api/chartofaccounts');

        $systemLeaf = ChartOfAccount::where('store_id', $this->storeA->id)
            ->where('is_system', true)
            ->where('is_payable', true)
            ->firstOrFail();

        $response = $this->deleteJson("/api/chartofaccounts/{$systemLeaf->id}");

        $response->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    public function test_cannot_delete_parent_with_children(): void
    {
        Sanctum::actingAs($this->userA);
        $this->getJson('/api/chartofaccounts');

        $parent = ChartOfAccount::where('store_id', $this->storeA->id)
            ->where('code', '111')
            ->firstOrFail();

        $response = $this->deleteJson("/api/chartofaccounts/{$parent->id}");

        $response->assertStatus(422)
            ->assertJsonPath('success', false);
    }

    public function test_entry_endpoint_returns_postable_active_accounts(): void
    {
        Sanctum::actingAs($this->userA);
        $this->getJson('/api/chartofaccounts');

        $response = $this->getJson('/api/accounttree/entry');

        $response->assertStatus(200);
        $data = $response->json();
        $this->assertIsArray($data);
        $this->assertNotEmpty($data);

        foreach ($data as $item) {
            $this->assertTrue($item['is_payable']);
            $this->assertTrue($item['is_active']);
        }
    }

    public function test_subaccount_creation_converts_parent_to_non_payable_and_rolls_up_balance(): void
    {
        Sanctum::actingAs($this->userA);
        $this->getJson('/api/chartofaccounts');

        $parent = ChartOfAccount::where('store_id', $this->storeA->id)
            ->where('code', '11101')
            ->firstOrFail();

        // Create two sub-accounts with balances
        $this->postJson('/api/chartofaccounts/store', [
            'name'            => 'فرع أ',
            'parent_id'       => $parent->id,
            'opening_balance' => 20000,
            'is_payable'      => true,
        ])->assertStatus(201);

        $this->postJson('/api/chartofaccounts/store', [
            'name'            => 'فرع ب',
            'parent_id'       => $parent->id,
            'opening_balance' => 30000,
            'is_payable'      => true,
        ])->assertStatus(201);

        // Parent should now be non-payable
        $this->assertFalse($parent->fresh()->is_payable);

        // Fetch tree and check balance calculation
        $response = $this->getJson('/api/chartofaccounts');
        $data = $response->json('data');

        $rootAsset = collect($data)->firstWhere('code', '1');
        // Final balance of root asset should include the 50,000
        $this->assertGreaterThanOrEqual(50000, $rootAsset['final_balance']);
    }

    public function test_different_tenants_can_have_identical_codes_without_collision(): void
    {
        Sanctum::actingAs($this->userA);
        $this->getJson('/api/chartofaccounts');

        $parentA = ChartOfAccount::where('store_id', $this->storeA->id)
            ->where('code', '11101')
            ->firstOrFail();

        // Store A creates code 11101555
        $respA = $this->postJson('/api/chartofaccounts/store', [
            'name'      => 'حساب متجر أ المشترك',
            'parent_id' => $parentA->id,
            'code'      => '11101555',
        ]);
        $respA->assertStatus(201);

        // Store B creates the same code 11101555
        Sanctum::actingAs($this->userB);
        $this->getJson('/api/chartofaccounts');

        $parentB = ChartOfAccount::where('store_id', $this->storeB->id)
            ->where('code', '11101')
            ->firstOrFail();

        $respB = $this->postJson('/api/chartofaccounts/store', [
            'name'      => 'حساب متجر ب المشترك',
            'parent_id' => $parentB->id,
            'code'      => '11101555',
        ]);
        $respB->assertStatus(201);

        // Verify both exist with proper store isolation
        $this->assertDatabaseHas('chart_of_accounts', [
            'store_id' => $this->storeA->id,
            'code'     => '11101555',
            'name'     => 'حساب متجر أ المشترك',
        ]);
        $this->assertDatabaseHas('chart_of_accounts', [
            'store_id' => $this->storeB->id,
            'code'     => '11101555',
            'name'     => 'حساب متجر ب المشترك',
        ]);
    }

    public function test_tenant_cannot_update_or_delete_other_tenants_account(): void
    {
        Sanctum::actingAs($this->userA);
        $this->getJson('/api/chartofaccounts');

        $parentA = ChartOfAccount::where('store_id', $this->storeA->id)
            ->where('code', '11101')
            ->firstOrFail();

        $accountA = ChartOfAccount::create([
            'store_id'        => $this->storeA->id,
            'parent_id'       => $parentA->id,
            'code'            => '11101666',
            'name'            => 'حساب خاص بـ أ',
            'level'           => $parentA->level + 1,
            'account_type'    => ChartOfAccount::TYPE_ASSET,
            'nature'          => ChartOfAccount::NATURE_DEBIT,
            'is_payable'      => true,
            'is_system'       => false,
            'opening_balance' => 1000,
        ]);

        // User B attempts to update Store A's account
        Sanctum::actingAs($this->userB);
        $responseUpdate = $this->postJson("/api/chartofaccounts/{$accountA->id}/update", [
            'name' => 'محاولة اختراق الحساب',
        ]);
        $responseUpdate->assertStatus(404);

        // User B attempts to delete Store A's account
        $responseDelete = $this->deleteJson("/api/chartofaccounts/{$accountA->id}");
        $responseDelete->assertStatus(404);

        // Verify Store A's account remains untouched
        $this->assertEquals('حساب خاص بـ أ', $accountA->fresh()->name);
    }

    public function test_next_code_endpoint_returns_valid_suggestions_and_depreciation_flag(): void
    {
        Sanctum::actingAs($this->userA);
        $this->getJson('/api/chartofaccounts');

        $parent = ChartOfAccount::where('store_id', $this->storeA->id)
            ->where('code', '11101')
            ->firstOrFail();

        $response = $this->getJson("/api/chartofaccounts/next-code?parent_id={$parent->id}");

        $response->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'data' => [
                    'parent_id',
                    'parent_code',
                    'parent_name',
                    'code',
                    'suggested_code',
                    'level',
                    'account_type',
                    'nature',
                    'cash_flow_type',
                    'is_depreciable',
                ],
            ]);

        $this->assertEquals('11101001', $response->json('data.suggested_code'));

        // Test alias route /accounttree/next-code
        $responseAlias = $this->getJson("/api/accounttree/next-code?parent_id={$parent->id}");
        $responseAlias->assertStatus(200)
            ->assertJsonPath('success', true);
    }
}
