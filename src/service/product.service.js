const { Specification, Product } = require('../model');
const ApiError = require('../exceptions/api.error');


class ProductService {
  async getSearchedProducts({ text, category }) {
    let products = [];

    if (category !== undefined) {
      products = await Product
        .find(
          { $text: { $search: text }, category },
          { score: { $meta: "textScore" } }
        )
        .populate('specifications.specObj')
        .sort({ score: { $meta: "textScore" } });
    } else {
      products = await Product
        .find(
          { $text: { $search: text } },
          { score: { $meta: "textScore" } }
        )
        .populate('specifications.specObj')
        .sort({ score: { $meta: "textScore" } });
    }

    return products;
  }

  async getMongooseQueries(query) {
    if (!query) throw ApiError.BadRequest('Не верная строка запроса');

    let queryArray = Object.entries(query);
    queryArray = queryArray.map((query) => {
      query[1] = query[1].split('_');
      return query
    })

    let urlNames = [];
    queryArray.forEach(([name]) => urlNames.push({ urlName: name }));

    const specifications = await Specification.find({ $or: [...urlNames] });
    if (!specifications || !specifications.length) {
      throw ApiError.BadRequest('Данные спецификации не найдены')
    }

    let mongooseQueries = [];

    // Create query object
    queryArray.forEach(([name, values]) => {
      values.forEach(value => {
        mongooseQueries.push({
          "specifications.specObj": name,
          "specifications.specValue": value
        })
      })
    });

    // Replace specObj name with it's _id
    mongooseQueries = mongooseQueries.map(query => {
      specifications.forEach(spec => {
        if (query["specifications.specObj"] === spec.urlName) {
          query["specifications.specObj"] = spec._id

          if (spec.type === "number") {
            query["specifications.specValue"] = +query["specifications.specValue"]
          }
        }
      });
      return query;
    })

    return mongooseQueries;
  }

  async getfilteredProducts(mongooseQueries) {
    const strictQueries = [];
    const softQueries = [];
    mongooseQueries.forEach(query => {
      if (query["specifications.specObj"] === mongooseQueries[0]["specifications.specObj"]) {
        strictQueries.push(query);
      } else {
        softQueries.push(query)
      }
    })

    let products;
    if (softQueries.length) {
      products = await Product.find({ $and: [{ $or: [...strictQueries] }, ...softQueries] }).populate('specifications.specObj');
    } else {
      products = await Product.find({ $or: [...strictQueries] }).populate('specifications.specObj');
    }

    if (!products || !products.length) {
      throw ApiError.BadRequest('Товар не найден');
    }
    return products;
  }
}

module.exports = new ProductService;