import { test, expect } from '@playwright/test';
import { format, addMonths, subMonths } from 'date-fns';

test.describe('Calendar Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('localhost:3000/calendar');
        await page.evaluate(() => localStorage.clear());
        await page.reload();
    });


    test('should navigate between months', async ({ page }) => {
        const currentDate = new Date();
        const currentMonth = format(currentDate, 'MMMM yyyy');

        await page.getByRole('button', { name: 'Next month' }).click();
        const nextMonth = format(addMonths(currentDate, 1), 'MMMM yyyy');
        await expect(page.getByText(nextMonth).first()).toBeVisible();

        await page.getByRole('button', { name: 'Previous month' }).click();
        await expect(page.getByText(currentMonth).first()).toBeVisible();

        await page.getByRole('button', { name: 'Previous month' }).click();
        const prevMonth = format(subMonths(currentDate, 1), 'MMMM yyyy');
        await expect(page.getByText(prevMonth).first()).toBeVisible();
    });

    test('should navigate to agenda view', async ({ page }) => {
        await page.getByRole('button', { name: 'Go to agenda view' }).click();
        await expect(page).toHaveURL(/\/agenda/);
    });

    test('should persist tasks between page refreshes', async ({ page }) => {
        await page.goto('localhost:3000/agenda');
        await page.getByPlaceholder('Task title...').fill('Persistent Task');
        await page.getByRole('button', { name: 'Add' }).click();

        await page.reload();
        await expect(page.getByText('Persistent Task')).toBeVisible();

        await page.getByRole('button', { name: 'Next month' }).click();
        await page.getByRole('button', { name: 'Go to agenda view' }).click();
        await expect(page.getByText('Persistent Task')).toBeVisible();
    });
});