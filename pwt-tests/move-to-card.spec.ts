import { test, expect } from '@playwright/test';

test('check navigation to offer page', async ({ page }) => {

    await page.goto('http://localhost:5173');

    await page.waitForSelector('.cities__card'); // Ожидаем загрузки карточек

    // Получение данных первой карточки
    const firstCardName = await page.locator('.place-card__name').first().textContent();
    const firstCardPrice = await page.locator('.place-card__price-value').first().textContent();

    // Переход по первой карточке
    await page.locator('.place-card__name').first().click();

    // Загрузка страницы предложения
    await page.waitForSelector('.offer__name');

    // Получение данных о предложении
    const offerName = await page.textContent('.offer__name');
    const offerPrice = await page.textContent('.offer__price-value');

    // Проверка, что данные на странице предложения совпадают с данными первой карточки
    expect(offerName).toBe(firstCardName);
    expect(offerPrice).toBe(firstCardPrice);

    // Проверка, что на странице предложения отображаются необходимые элементы
    expect(await page.isVisible('.offer__gallery')).toBe(true);
    expect(await page.isVisible('.offer__rating')).toBe(true);
    expect(await page.isVisible('.offer__price')).toBe(true);
    expect(await page.isVisible('.offer__inside')).toBe(true);
    expect(await page.isVisible('.offer__host')).toBe(true);
    expect(await page.isVisible('.offer__description')).toBe(true);
    expect(await page.isVisible('.reviews')).toBe(true);
});
