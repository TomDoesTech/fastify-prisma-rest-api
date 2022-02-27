import prisma from "../../utils/prisma";
import { CreateProductInput } from "./product.schema";

export async function createProduct(
  data: CreateProductInput & { ownerId: number }
) {
  return prisma.product.create({
    data,
  });
}

export function getProducts() {
  return prisma.product.findMany({
    select: {
      content: true,
      title: true,
      price: true,
      id: true,
      createdAt: true,
      updatedAt: true,
      owner: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });
}
