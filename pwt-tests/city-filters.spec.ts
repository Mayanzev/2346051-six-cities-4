import { test, expect } from '@playwright/test';

test('should change city and update offers list with different offers', async ({ page }) => {

    await page.goto('http://localhost:5173');
    await page.waitForSelector('.locations__list');

    const initialCity = 'Cologne';
    await page.click(`.locations__item-link:has-text("${initialCity}")`);  // Выбор начального города
    await expect(page.locator('.places__found')).toContainText(initialCity); // Проверка, что выбранный город отображается на странице

    // Собирается текстовое содержимое всех карточек предложений в массив
    const firstCityCards: string[] = [];
    for (const cardElement of await page.locator('.cities__card').all()) {
        const cardTextContent = await cardElement.textContent();
        if (cardTextContent !== null) { 
            firstCityCards.push(cardTextContent);
        }
    }
    expect(firstCityCards.length).toBe(20); // Проверка что количество собранных карточек соответствует 20


    const otherCity = 'Amsterdam';
    await page.click(`.locations__item-link:has-text("${otherCity}")`); // Выбор другого города
    await expect(page.locator('.places__found')).toContainText(otherCity); // Проверка, что выбранный город отображается на странице

    // Собирается текстовое содержимое всех карточек предложений в массив другого города
    const secondCityCards: string[] = [];
    const secondCityCardElements = await page.locator('.cities__card').all();
    for (const cardElement of secondCityCardElements) {
        const cardTextContent = await cardElement.textContent();
        if (cardTextContent !== null) { 
            secondCityCards.push(cardTextContent);
        }
    }
    expect(secondCityCards.length).toBe(20); // Проверка что количество собранных карточек соответствует 20


    // Проверяем, что ни одна карточка из первого города не включена в массив карточек второго города 
    for (const cardTextContent of firstCityCards) {
        expect(secondCityCards.includes(cardTextContent)).toBe(false);
    }
});
