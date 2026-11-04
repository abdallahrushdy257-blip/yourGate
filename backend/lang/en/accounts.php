<?php

return [
    'fetched'        => 'Chart of accounts fetched successfully.',
    'created'        => 'Account created successfully.',
    'updated'        => 'Account updated successfully.',
    'deleted'        => 'Account deleted successfully.',
    'seeded'         => 'Default chart of accounts initialized (:count new accounts).',

    'cash_flow' => [
        'operating' => 'Operating',
        'investing' => 'Investing',
        'financing' => 'Financing',
    ],

    'types' => [
        'asset'      => 'Assets',
        'liability'  => 'Liabilities',
        'net_assets' => 'Net Assets',
        'revenue'    => 'Revenues',
        'expense'    => 'Expenses',
    ],

    'errors' => [
        'has_children'       => 'Cannot delete an account that has sub-accounts.',
        'system_account'     => 'Default template accounts cannot be deleted; deactivate it instead.',
        'parent_has_balance' => 'Cannot add a sub-account under an account that has a balance.',
        'code_overflow'      => 'No more codes are available under this parent account.',
        'invalid_code'       => 'Account code must start with the parent account code.',
        'template_missing'   => 'Chart of accounts template file not found: :path',
    ],
];
