import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../infrastructure/product/repository/sequelize/product.repository";
import FindProductUseCase from "./find/find.product.usecase";
import ProductFactory from "../../domain/product/factory/product.factory";
import UpdateProductUseCase from "./update/update.product.usecase";
import ListProductUseCase from "./list/list.product.usecase";

describe("product integration usecase", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("update product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new UpdateProductUseCase(productRepository);

    const product = ProductFactory.createNew("product one", 1.94);

    await productRepository.create(product);

    const input = {
      id: product.id,
      name: "product one updated",
      price: 2.55,
    };

    const output = await usecase.execute(input);
    expect(output).toEqual(input);
  });

  it("update and list products", async () => {
    const productRepository = new ProductRepository();
    const useCase = new ListProductUseCase(productRepository);

    const product1 = ProductFactory.createNew("Product A", 10);
    const product2 = ProductFactory.createNew("Product B", 20);

    await productRepository.create(product1);
    await productRepository.create(product2);

    product1.changeName("Product A and B");
    product1.changePrice(30);
    await productRepository.update(product1);

    const output = await useCase.execute({});

    expect(output.products.length).toBe(2);
    expect(output.products[0].id).toBe(product1.id);
    expect(output.products[0].name).toBe(product1.name);
    expect(output.products[0].price).toBe(product1.price);

    expect(output.products[1].id).toBe(product2.id);
    expect(output.products[1].name).toBe(product2.name);
    expect(output.products[1].price).toBe(product2.price);
  });

  it("find product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new FindProductUseCase(productRepository);

    const product = ProductFactory.createNew("my product", 1.97);

    await productRepository.create(product);

    const input = {
      id: product.id,
    };

    const output = {
      id: product.id,
      name: "my product",
      price: 1.97
    };

    const result = await usecase.execute(input);

    expect(result).toEqual(output);
  });
});
