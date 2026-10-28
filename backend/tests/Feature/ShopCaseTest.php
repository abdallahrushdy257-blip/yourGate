<?php

namespace Tests\Feature;

use App\Models\HumanCase;
use App\Models\Shop;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ShopCaseTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Store $store;

    protected function setUp(): void
    {
        parent::setUp();

        $this->store = Store::create([
            'name'   => 'Charity Store 1',
            'slug'   => 'store1',
            'status' => 'active',
        ]);

        $this->user = User::factory()->create([
            'store_id' => $this->store->id,
        ]);

        Sanctum::actingAs($this->user);
    }

    public function test_user_can_list_shop_cases_filtered_by_store(): void
    {
        $otherStore = Store::create([
            'name'   => 'Other Store',
            'slug'   => 'store2',
            'status' => 'active',
        ]);

        Shop::create([
            'store_id'        => $this->store->id,
            'title'           => 'حالة علاج مريض بالمتجر الأول',
            'total'           => 15000,
            'amount'          => 5000,
            'status'          => 0,
            'marketingmethod' => 1,
        ]);

        Shop::create([
            'store_id'        => $otherStore->id,
            'title'           => 'حالة بالمتجر الثاني',
            'total'           => 8000,
            'amount'          => 0,
            'status'          => 0,
            'marketingmethod' => 2,
        ]);

        $response = $this->getJson('/api/shop');

        $response->assertStatus(200);
        $data = $response->json();
        $this->assertCount(1, $data);
        $this->assertEquals('حالة علاج مريض بالمتجر الأول', $data[0]['title']);
        $this->assertEquals('المانحين', $data[0]['marketingmethod_string']);
    }

    public function test_user_can_create_shop_case_successfully(): void
    {
        Storage::fake('public');

        $beneficiary = HumanCase::create([
            'store_id'      => $this->store->id,
            'name'          => 'سالم الدوسري',
            'gender'        => 0,
            'dob'           => '1990-01-01',
            'humancasetype' => 1,
            'status'        => 1,
            'case_status'   => 1,
            'idnumber'      => '1099887766',
            'phonenum'      => '0501112233',
        ]);

        $payload = [
            'name'               => 'حالة سداد إيجار أسرة محتاجة',
            'benf'               => $beneficiary->id,
            'totalCost'          => 24000,
            'isAssetsSelected'   => true,
            'numberOfAssets'     => 24,
            'mainCategory'       => 'حالة اغاثة',
            'subCategory'        => 'إجتماعية',
            'marketingmethod'    => 1,
            'postDate'           => '2026-10-01',
            'deedlineDate'       => '2026-11-01',
            'description'        => 'وصف الحالة الإغاثية',
            'document'           => UploadedFile::fake()->create('medical_report.pdf', 500, 'application/pdf'),
        ];

        $response = $this->postJson('/api/shop/store', $payload);

        $response->assertStatus(201)
                 ->assertJsonPath('success', true)
                 ->assertJsonPath('data.title', 'حالة سداد إيجار أسرة محتاجة')
                 ->assertJsonPath('data.cost_per_asset', 1000)
                 ->assertJsonPath('data.beneficiary_name', 'سالم الدوسري');

        $this->assertDatabaseHas('shops', [
            'store_id'       => $this->store->id,
            'title'          => 'حالة سداد إيجار أسرة محتاجة',
            'total'          => 24000,
            'cost_per_asset' => 1000,
        ]);
    }

    public function test_create_shop_case_validation_fails_without_title_and_total(): void
    {
        $response = $this->postJson('/api/shop/store', []);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['title', 'total']);
    }

    public function test_user_can_show_shop_case(): void
    {
        $case = Shop::create([
            'store_id'        => $this->store->id,
            'title'           => 'كفالة أيتام',
            'total'           => 12000,
            'amount'          => 3000,
            'status'          => 0,
            'marketingmethod' => 3,
        ]);

        $response = $this->getJson("/api/shop/{$case->id}/view");

        $response->assertStatus(200)
                 ->assertJsonPath('id', $case->id)
                 ->assertJsonPath('title', 'كفالة أيتام')
                 ->assertJsonPath('remaining', 9000)
                 ->assertJsonPath('percentage', 25);
    }

    public function test_user_can_update_shop_case(): void
    {
        $case = Shop::create([
            'store_id' => $this->store->id,
            'title'    => 'حالة قديمة',
            'total'    => 5000,
            'amount'   => 0,
            'status'   => 0,
        ]);

        $payload = [
            'id'        => $case->id,
            'title'     => 'حالة بعد التحديث',
            'totalCost' => 7500,
            'amount'    => 2500,
        ];

        $response = $this->postJson('/api/shop/update', $payload);

        $response->assertStatus(200)
                 ->assertJsonPath('success', true)
                 ->assertJsonPath('data.title', 'حالة بعد التحديث')
                 ->assertJsonPath('data.total', 7500);

        $this->assertDatabaseHas('shops', [
            'id'    => $case->id,
            'title' => 'حالة بعد التحديث',
            'total' => 7500,
        ]);
    }

    public function test_user_can_close_shop_case(): void
    {
        $case = Shop::create([
            'store_id' => $this->store->id,
            'title'    => 'حالة اكتمل التبرع لها',
            'total'    => 10000,
            'amount'   => 10000,
            'status'   => 0,
        ]);

        $response = $this->getJson("/api/shop/{$case->id}/close");

        $response->assertStatus(200)
                 ->assertJsonPath('success', true)
                 ->assertJsonPath('data.status', 1);

        $this->assertEquals(1, $case->fresh()->status);
    }

    public function test_user_can_delete_shop_case(): void
    {
        $case = Shop::create([
            'store_id' => $this->store->id,
            'title'    => 'حالة ملغاة',
            'total'    => 2000,
            'amount'   => 0,
            'status'   => 0,
        ]);

        $response = $this->deleteJson("/api/shop/{$case->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('success', true);

        $this->assertSoftDeleted('shops', ['id' => $case->id]);
    }

    public function test_user_can_get_shop_case_stats(): void
    {
        Shop::create([
            'store_id' => $this->store->id,
            'title'    => 'حالة 1',
            'total'    => 10000,
            'amount'   => 3000,
            'status'   => 0,
        ]);

        Shop::create([
            'store_id' => $this->store->id,
            'title'    => 'حالة 2',
            'total'    => 20000,
            'amount'   => 20000,
            'status'   => 1,
        ]);

        $response = $this->getJson('/api/shop/stats');

        $response->assertStatus(200)
                 ->assertJsonPath('data.total_cases', 2)
                 ->assertJsonPath('data.active_cases', 1)
                 ->assertJsonPath('data.completed_cases', 1)
                 ->assertJsonPath('data.total_target_amount', 30000)
                 ->assertJsonPath('data.total_collected_amount', 23000);
    }

    public function test_user_can_store_and_list_receipt_donations_for_shop_case(): void
    {
        $case = Shop::create([
            'store_id' => $this->store->id,
            'title'    => 'حالة كفالة مريض',
            'total'    => 10000,
            'amount'   => 0,
            'status'   => 0,
        ]);

        $receiptResponse = $this->postJson('/api/shoptransaction/storerec', [
            'shop_id' => $case->id,
            'amount'  => 2500,
            'type'    => '1',
            'date'    => '2026-10-26',
            'account' => 'البنك الأهلي',
            'notes'   => 'تبرع فاعل خير',
        ]);

        $receiptResponse->assertStatus(201)
                        ->assertJsonPath('data.amount', 2500)
                        ->assertJsonPath('data.transaction_type', 1);

        $case->refresh();
        $this->assertEquals(2500, $case->amount);

        // List transactions
        $listResponse = $this->getJson("/api/shoptransaction/{$case->id}");
        $listResponse->assertStatus(200)
                     ->assertJsonCount(1);
    }

    public function test_user_can_store_payment_voucher_for_shop_case(): void
    {
        $case = Shop::create([
            'store_id' => $this->store->id,
            'title'    => 'حالة كسوة شتاء',
            'total'    => 5000,
            'amount'   => 5000,
            'status'   => 1,
        ]);

        $payResponse = $this->postJson('/api/shoptransaction/storepay', [
            'shop_id' => $case->id,
            'amount'  => 1200,
            'type'    => '1',
            'date'    => '2026-10-26',
            'notes'   => 'شراء كسوة شتاء',
        ]);

        $payResponse->assertStatus(201)
                    ->assertJsonPath('data.amount', 1200)
                    ->assertJsonPath('data.transaction_type', 2);
    }

    public function test_user_can_store_design_and_marketing_requests(): void
    {
        Storage::fake('public');

        $case = Shop::create([
            'store_id' => $this->store->id,
            'title'    => 'حالة مشروع تعليمي',
            'total'    => 15000,
            'amount'   => 0,
            'status'   => 0,
        ]);

        $file1 = UploadedFile::fake()->create('banner.png', 500, 'image/png');
        $file2 = UploadedFile::fake()->create('brochure.pdf', 1000, 'application/pdf');

        $response = $this->postJson('/api/shopdetails/store', [
            'id'          => $case->id,
            'type'        => 1,
            'description' => 'طلب بوستر ومطبوعات للحملة',
            'note'        => 'ألوان ذهبية وبنية',
            'upload'      => $file1,
            'upload2'     => $file2,
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.type', 1)
                 ->assertJsonPath('data.type_string', 'طلب تصميم');

        $this->assertDatabaseHas('shop_details', [
            'shop_id'     => $case->id,
            'type'        => 1,
            'description' => 'طلب بوستر ومطبوعات للحملة',
        ]);
    }
}
