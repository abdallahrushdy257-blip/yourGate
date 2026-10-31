<?php

namespace Tests\Feature;

use App\Models\Shop;
use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Store $store;

    protected function setUp(): void
    {
        parent::setUp();

        $this->store = Store::create([
            'name'   => 'جمعية الخير التجريبية',
            'slug'   => 'test-ad-store',
            'status' => 'active',
        ]);

        $this->user = User::factory()->create([
            'store_id' => $this->store->id,
        ]);
    }

    public function test_user_can_store_ad_request_for_shop_case(): void
    {
        $shop = Shop::create([
            'store_id'     => $this->store->id,
            'title'        => 'حالة علاج مريض',
            'total'        => 5000,
            'status'       => 0,
            'dateoflaunch' => '2026-10-26',
        ]);

        $response = $this->actingAs($this->user, 'sanctum')->postJson('/api/ads/shop/store', [
            'id'    => $shop->id,
            'notes' => 'طلب إعلان ممول للحالة عبر المنصة',
        ]);

        $response->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.shop_id', $shop->id)
            ->assertJsonPath('data.ad_approved', false);

        $this->assertDatabaseHas('ads', [
            'store_id' => $this->store->id,
            'shop_id'  => $shop->id,
        ]);
    }

    public function test_user_can_list_ads_and_update_status(): void
    {
        $shop = Shop::create([
            'store_id'     => $this->store->id,
            'title'        => 'حالة إغاثة',
            'total'        => 3000,
            'status'       => 0,
            'dateoflaunch' => '2026-10-26',
        ]);

        $createRes = $this->actingAs($this->user, 'sanctum')->postJson('/api/ads/shop/store', [
            'shop_id' => $shop->id,
        ]);
        $adId = $createRes->json('data.id');

        $listRes = $this->actingAs($this->user, 'sanctum')->getJson('/api/organization/ads');
        $listRes->assertOk()
            ->assertJsonCount(1);

        $updateRes = $this->actingAs($this->user, 'sanctum')->postJson('/api/organization/ads/status/update', [
            'id'       => $adId,
            'approved' => 1,
        ]);

        $updateRes->assertOk()
            ->assertJsonPath('data.approved', true);

        $this->assertDatabaseHas('ads', [
            'id'          => $adId,
            'ad_approved' => 1,
        ]);
    }

    public function test_user_can_get_donation_accounts(): void
    {
        $response = $this->actingAs($this->user, 'sanctum')->getJson('/api/transactions/components/donations');

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(5, 'data');
    }
}
