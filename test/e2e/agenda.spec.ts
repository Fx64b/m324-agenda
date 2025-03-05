import { test, expect } from '@playwright/test';

test.describe('Agenda Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('localhost:3000/agenda');
        await page.evaluate(() => localStorage.clear());
        await page.reload();
    });

    test('should display the agenda page correctly', async ({ page }) => {
        await expect(page.getByText('Agenda')).toBeVisible();
        await expect(page.getByPlaceholder('Task title...')).toBeVisible();
        await expect(page.getByPlaceholder('Description (optional)')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Add' })).toBeVisible();
    });

    test('should add a new task successfully', async ({ page }) => {
        await page.getByPlaceholder('Task title...').fill('Test Task');
        await page.getByPlaceholder('Description (optional)').fill('Test description');

        await page.getByRole('combobox').click();
        await page.getByRole('option', { name: 'High' }).click();

        await page.getByRole('button', { name: 'Add' }).click();

        await expect(page.getByText('Test Task')).toBeVisible();
        await expect(page.getByText('Test description')).toBeVisible();
    });

    test('should toggle task completion status', async ({ page }) => {
        await page.getByPlaceholder('Task title...').fill('Toggle Task');
        await page.getByRole('button', { name: 'Add' }).click();

        const toggleButton = page.getByRole('button', { name: 'Toggle task completion' });
        await toggleButton.click();
        await expect(page.getByText('Toggle Task')).toHaveClass(/line-through/);

        await toggleButton.click();
        await expect(page.getByText('Toggle Task')).not.toHaveClass(/line-through/);
    });

    test('should delete a task', async ({ page }) => {
        await page.getByPlaceholder('Task title...').fill('Delete Task');
        await page.getByRole('button', { name: 'Add' }).click();

        await page.getByRole('button', { name: 'Delete task' }).click();

        await expect(page.getByText('Delete Task')).not.toBeVisible();
    });

    test('should filter tasks by completion status', async ({ page }) => {
        await page.getByPlaceholder('Task title...').fill('Active');
        await page.getByRole('button', { name: 'Add' }).click();

        await page.getByPlaceholder('Task title...').fill('Completed Task');
        await page.getByRole('button', { name: 'Add' }).click();

        const toggleButtons = await page.getByRole('button', { name: 'Toggle task completion' }).all();
        await toggleButtons[1].click();

        await page.getByRole('tab', { name: 'Active' }).click();
        await expect(page.getByText('Active')).toBeVisible();

        await page.getByRole('tab', { name: 'Completed' }).click();
        await expect(page.getByText('Completed')).toBeVisible();
    });

    test('should filter by high priority', async ({ page }) => {
        await page.getByPlaceholder('Task title...').fill('Regular Task');
        await page.getByRole('button', { name: 'Add' }).click();

        await page.getByPlaceholder('Task title...').fill('Important Task');
        await page.getByRole('combobox').click();
        await page.getByRole('option', { name: 'High' }).click();
        await page.getByRole('button', { name: 'Add' }).click();

        await page.getByRole('tab', { name: 'High Priority' }).click();

        await expect(page.getByText('Important Task')).toBeVisible();
        await expect(page.getByText('Regular Task')).not.toBeVisible();
    });

    test('should navigate to calendar view', async ({ page }) => {
        await page.getByRole('button', { name: 'Next month' }).click();
        await expect(page).toHaveURL(/\/calendar/);
    });
});