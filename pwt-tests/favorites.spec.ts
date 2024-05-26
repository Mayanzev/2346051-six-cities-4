import { test, expect } from '@playwright/test';

test('favorites screen functionality', async ({ page }) => {

    // Пользователь не залогинен
    await page.goto('http://localhost:5173');
    await page.waitForSelector('.cities__card'); // Ожидаем загрузки карточек
    await page.locator('.place-card__name').first().click(); // Переход по первой карточке
    await page.waitForSelector('.offer__name'); // Загрузка страницы предложения
    await page.click('.place-card__bookmark-button'); // Попытка добавить в избранное
    await expect(page).toHaveURL('http://localhost:5173/login'); // Ожидание экрана Login

    await page.goto('http://localhost:5173'); // Возврат на главную страницу
    await page.waitForSelector('.cities__card');
    await page.locator('.place-card__bookmark-button').first().click(); // Попытка добавить первую карточку в избранное
    await expect(page).toHaveURL('http://localhost:5173/login'); // Ожидание экрана Login

    await page.goto('http://localhost:5173/favorites'); // Попытка перехода на favorites
    await expect(page).toHaveURL('http://localhost:5173/login'); // Ожидание экрана Login


    // Пользователь залогинен
    await page.goto('http://localhost:5173/favorites');

    // Проверка, что пользователь перенаправлен на страницу логина
    await expect(page).toHaveURL('http://localhost:5173/login');

    // Логинимся
    await page.fill('input[name="email"]', 'test@test.com');
    await page.fill('input[name="password"]', 'qwerty123');
    await page.click('button[type="submit"]');

    await page.waitForTimeout(2000);

    // Проверяем, перешел ли пользователь на главную страницу
    await expect(page).toHaveURL('http://localhost:5173/');

    // Получаем начальное количество избранных карточек из интерфейса
    let initialFavoritesCount = Number(await page.locator('.header__favorite-count').textContent());

    // Переходим на главную страницу и находим первую и последнюю карточки
    await page.waitForSelector('.cities__card');
    const firstBookmarkButton = page.locator('.place-card__bookmark-button').first(); // Находим первую кнопку добавления в избранное

    // Проверяем текущее состояние кнопки
    const initialFirstClasses = await firstBookmarkButton.getAttribute('class');
    const isInitiallyFirstFavorite = initialFirstClasses ? initialFirstClasses.includes('place-card__bookmark-button--active') : false;

    await firstBookmarkButton.click(); // Кликаем по кнопке добавления/удаления из избранного
    await page.waitForTimeout(1000); // Ожидание для завершения запроса

    // Проверяем, что остались на главной странице и что иконка первой карточки изменила состояние
    await expect(page).toHaveURL('http://localhost:5173/');
    const updatedFirstClasses = await firstBookmarkButton.getAttribute('class');
    const isNowFirstFavorite = updatedFirstClasses ? updatedFirstClasses.includes('place-card__bookmark-button--active') : false;
    expect(isNowFirstFavorite).toBe(!isInitiallyFirstFavorite);

    // Определяем ожидаемое количество избранных карточек
    let expectedFavoritesCount = initialFavoritesCount;
    if (initialFavoritesCount > 0) {
        expectedFavoritesCount += isNowFirstFavorite ? 1 : -1;
    } else {
        expectedFavoritesCount = isNowFirstFavorite ? 1 : 0;
    }

    // Получаем обновленное количество избранных карточек из интерфейса
    let updatedFavoritesCount = Number(await page.locator('.header__favorite-count').textContent());

    // Сравниваем количество карточек
    expect(updatedFavoritesCount).toBe(expectedFavoritesCount);


    // Проверка перехода на страницу Favorites
    await page.goto('http://localhost:5173/favorites');
    // Проверяем, что пользователь перенаправлен на страницу Favorites
    await expect(page).toHaveURL('http://localhost:5173/favorites');
});
