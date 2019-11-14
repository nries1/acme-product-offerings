const Sequelize = require('sequelize');
const connection = new Sequelize('postgres://localhost:5432', {
  logging: false
});
const { UUID, UUIDV4 } = Sequelize;
const productList = require('./products.js');
const companyList = require('./companies.js');
const chalk = require('chalk');

const uuidDefinition = {
  type: UUID,
  primaryKey: true,
  defaultValue: UUIDV4
};
const Product = connection.define('product', {
  name: {
    type: Sequelize.STRING,
    unique: true
  },
  id: uuidDefinition,
  price: {
    type: Sequelize.STRING
  }
});

const Company = connection.define('company', {
  name: {
    type: Sequelize.STRING,
    unique: true
  },
  id: uuidDefinition
});

const Offering = connection.define('offering', {
  name: {
    type: Sequelize.STRING
  },
  price: {
    type: Sequelize.DECIMAL
  }
});

Product.hasMany(Company);
Company.hasMany(Offering);
Product.hasMany(Offering);

const seedAndSync = async () => {
  try {
    await connection.sync({ force: true });
    const companies = await Promise.all(
      companyList.map(company => Company.create(company))
    );
    const products = await Promise.all(
      productList.map(product => Product.create(product))
    );
    const offerings = companies.forEach(company => {
      products.forEach(product => {
        let newOffering = {
          companyId: company.id,
          productId: product.id,
          price: product.price + Math.floor(Math.random() * 5)
        };
        Offering.create(newOffering);
      });
    });
  } catch (e) {
    console.log(chalk.red(e));
  }
};

module.exports = {
  connection,
  models: {
    Product,
    Company,
    Offering
  },
  seedAndSync
};
