import { test, expect } from '@playwright/test';

test('check login form functionality', async ({ page }) => {
    
    await page.goto('http://localhost:5173/login'); // Открытие страницы логина

    // Ввод верных данных в поля формы
    await page.fill('input[name="email"]', 'test@test.com');
    await page.fill('input[name="password"]', 'qwerty123');

    await page.click('button[type="submit"]'); // Отправка формы

    await page.waitForTimeout(2000); 
 
    expect(page.url()).toBe('http://localhost:5173/'); // Проверка, перешли ли на главную страницу

    // Проверка, что в навигационном меню отображается профиль пользователя и количество избранных предложений
    expect(await page.isVisible('.header__nav-link--profile')).toBe(true);
    expect(await page.isVisible('.header__favorite-count')).toBe(true);



    // Проверка, что произошел выход из аккаунта
    await page.click('.header__signout');
    expect(page.url()).toBe('http://localhost:5173/login');

    // Попытка входа с некорректными учетными данными
    await page.fill('input[name="email"]', 'wrong@example');
    await page.fill('input[name="password"]', 'wrongpassword');

    await page.click('button[type="submit"]'); // Отправка формы

    await page.waitForTimeout(2000);

    await expect(page).toHaveURL('http://localhost:5173/login'); // Проверка, что мы остались на странице логина
});
