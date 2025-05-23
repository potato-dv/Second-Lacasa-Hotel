// resources/js/pages/settings/AdminAppearance.tsx
import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/admin-components/appearance-tabs';
import HeadingSmall from '@/admin-components/heading-small';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/admin-layouts/app-layout';
import SettingsLayout from '@/admin-layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: '/admin/settings/appearance',
    },
];

// Make sure the component name matches the Pascal-cased version that Inertia expects
export default function AdminAppearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Appearance settings" description="Update your account's appearance settings" />
                    <AppearanceTabs />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}