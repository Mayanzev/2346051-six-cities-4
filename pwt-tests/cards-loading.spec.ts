import { test, expect } from '@playwright/test';

test('check loading cards from server', async ({ page }) => {

    await page.goto('http://localhost:5173');

    await page.waitForSelector('.cities__card'); // Ожидание появления как минимум одной карточки предложения

    const cardElements = await page.locator('.cities__card');
    const cardElementsCount = await cardElements.count(); // Поиск всех элементов на странице с выбранным классом
    
    expect(cardElementsCount).toBeGreaterThan(0); // Проверка, что количество отображенных карточек больше 0
    expect(cardElementsCount).toBeLessThanOrEqual(20); // Проверка, что количество отображенных карточек не превышает 20

    for (let i = 0; i < cardElementsCount; i++) {
        const currentCardElement = cardElements.nth(i);
        await expect(currentCardElement.locator('.place-card__image')).toHaveAttribute('src', /https:\/\/.+[.]jpg/); // Проверка наличия картинки
        await expect(currentCardElement.locator('.place-card__price')).toHaveText(/^\€\d+/); // Проверка наличия цены
        await expect(currentCardElement.locator('.place-card__rating')).toBeVisible(); // Проверка наличия рейтинга
    }
});
 
