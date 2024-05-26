import { test, expect } from '@playwright/test';

test('check sorting of cards by price', async ({ page }) => {

    await page.goto('http://localhost:5173');

    await page.waitForSelector('.cities__card'); // Ожидаем загрузки карточек


    // Получение цен в Popular
    const pricesBeforeSorting = (
        await page.locator('.place-card__price-value').allTextContents()
    ).map((price) => Number(price.replace('€', '').trim()));

    const sortedPricesUp = pricesBeforeSorting.slice().sort((a, b) => a - b); // Сортировка цен в порядке возрастания
    const sortedPricesDown = pricesBeforeSorting.slice().sort((a, b) => b - a); // Сортировка цен в порядке убывания


    // Выбор сортировки от меньшего к большему
    await page.click('.places__sorting-type');
    await page.click('text="Price: low to high"');

    // Цены всех карточек после сортировки
    const pricesAfterSortingUp = (
        await page.locator('.place-card__price-value').allTextContents()
    ).map((price) => Number(price.replace('€', '').trim()));

    // Выбор сортировки от большего к меньшему
    await page.click('.places__sorting-type');
    await page.click('text="Price: high to low"');

    // Цены всех карточек после сортировки
    const pricesAfterSortingDown = (
        await page.locator('.place-card__price-value').allTextContents()
    ).map((price) => Number(price.replace('€', '').trim()));

    // Проверяем, что цены карточек после сортировки совпадают с ожидаемым порядком
    expect(pricesAfterSortingUp).toEqual(sortedPricesUp);
    expect(pricesAfterSortingDown).toEqual(sortedPricesDown);


    // Возврат на Popular
    await page.click('.places__sorting-type');
    await page.click('text="Popular"');

    // Цены всех карточек после сортировки
    const pricesAfterSorting = (
        await page.locator('.place-card__price-value').allTextContents()
    ).map((price) => Number(price.replace('€', '').trim()));

    // Проверка, что цены в начале проверки совпадают после всех сортировок
    expect(pricesAfterSorting).toEqual(pricesBeforeSorting);

    // Проверка, что цены отличаются от сортировки по убыванию
    expect(pricesAfterSorting).not.toEqual(pricesAfterSortingDown);

    // Проверка, что цены отличаются от сортировки по возрастанию
    expect(pricesAfterSorting).not.toEqual(sortedPricesUp);
});
