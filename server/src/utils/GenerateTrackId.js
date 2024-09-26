import { ApplicationCounter } from "../models/ApplicationsCounter.model.js";

export const generateApplicationId = async (positionTitle) => {
  const initials = positionTitle
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("")
    .slice(0, 2);

  let counter = await ApplicationCounter.findOne();
  if (!counter) {
    counter = await ApplicationCounter.create({ currentNumber: 0 });
  }

  counter.currentNumber += 1;
  await counter.save();

  const sequenceNumber = counter.currentNumber.toString().padStart(4, "0"); 
  return `${initials}${sequenceNumber}`;
};
