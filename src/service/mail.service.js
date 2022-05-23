const nodemailer = require('nodemailer');

class MailService {

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    })
  }

  #createProductItemHTML(productItem) {
    const productItemPrice = (productItem.quantity * productItem.product.price)
      .toFixed(2)
      .split('.')
      .join(',');

    return `
      <li style="height: 80px; display: flex; align-items: center; border-bottom: 1px solid rgb(197, 197, 197); margin: 0 0 10px 0;">
        <div style="width: 20%; height: 100%;">
          <img src="${productItem.product.image}" style="max-height: 100%; max-width: 100%;">
        </div>

        <div style="width: 60%;">
          <a href="${process.env.CLIENT_URL}/catalog/${productItem.product.article}">
            <h3>${productItem.product.name}</h3> 
          </a>
          <p style="color: #929292;">${productItem.quantity} шт.</p>
        </div>

        <p style="width: 20%;">${productItemPrice} грн.</p>
      </li>
    `
  }

  #createProductsHTML(products = [], orderData) {
    let HTML = `
      <ul style="margin-bottom: 20px; border-bottom: 1px solid #929292; padding: 0; margin-top: 0;">
    `;

    products.forEach(product => {
      const productItemsHTML = this.#createProductItemHTML(product, orderData);
      HTML = `
        ${HTML}
        ${productItemsHTML}
      `;
    });

    HTML = `
      ${HTML}
      </ul>
    `;

    return HTML;
  }

  #createOrderTimeString(orderTime = 0) {
    const time = new Date(orderTime);
    let day = String(time.getDate());
    let month = String(time.getMonth() + 1);
    let year = String(time.getFullYear());

    if (day.length < 2) {
      day = '0' + day;
    }

    if (month.length < 2) {
      month = '0' + month;
    }

    return `${day}.${month}.${year}`;
  }

  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Активация аккаунта на " + process.env.API_URL,
      text: "",
      html:
        `
          <div>
            <h1>Для активации перейдите по ссылке</h1>
            <a href="${link}">${link}</a>
          </div>        
        `
    })
  }

  async sendOrderMail(products, orderData, userData) {
    const productsUl = this.#createProductsHTML(products, orderData);
    const timeString = this.#createOrderTimeString(orderData.time);

    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to: userData.email,
      subject: `Заказ №${orderData.time} на LodeStar.com.ua`,
      text: "",
      html:
        `
          <div style="max-width: 900px">
            <a style="text-decoration: none; max-width: 150px" href="${process.env.CLIENT_URL}">
              <img src="${process.env.IMAGES_PATH + 'Lodestar Logo.jpg'}">
            </a>
            <h1 style="font-size: 22px;">Информация о заказе в интернет-магазине Lodestar.com.ua</h1>

            <p style="font-size: 16px; padding-bottom: 30px; border-bottom: 1px solid #929292;">Здравствуйте, ${userData.name}.
            Номер вашего заказа – <span style="color: #eb0000;">№${orderData.time}</span>, от ${timeString}. Статус заказа можно проверить в личном кабинете, в разделе История заказов. Спасибо, что выбрали интернет-магазин Lodestar.</p>

            ${productsUl}

            <p style="margin-bottom: 10px; font-size: 14px;">Общее количество товаров: <span style="font-weight:600;">${orderData.itemsQuantity} шт.</span></p>
            <p style="margin-bottom: 10px; font-size: 14px;">Итоговая сумма заказа: <span style="font-weight:600;">${orderData.totalCost} грн.</span></p>

          </div>
        `
    })
  }
};

module.exports = new MailService();