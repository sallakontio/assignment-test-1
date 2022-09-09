const { paymentProcess, checkPersonObject, makePayment } = require("./payment");
const fetchMock = require("jest-fetch-mock");

fetchMock.enableMocks();

beforeEach(() => {
  fetch.resetMocks();
});

describe("flow", () => {
  it("test the payment flow", async () => {
    fetch.mockResponseOnce(JSON.stringify({ validCard: true }));
    fetch.mockResponseOnce(JSON.stringify({ ok: true }));

    const person = {
      firstName: "James",
      middleName: "Roger",
      lastName: "Smith",
    };
    const cc = {
      number: "0123456789012345",
      cvc: "123",
    };
    const payment = { sum: 10 };
    const paymentIsOk = await paymentProcess(person, cc, payment);

    expect(paymentIsOk).toBe("OK");
  });

  it("test the payment flow - INVALID_CARD", async () => {
    fetch.mockResponseOnce(JSON.stringify({ validCard: false }));
    fetch.mockResponseOnce(JSON.stringify({ ok: true }));

    const person = {
      firstName: "James",
      middleName: "Roger",
      lastName: "Smith",
    };
    const cc = {
      number: "0123456789012345",
      cvc: "123",
    };
    const payment = { sum: 10 };

    const person2 = {
      firstName: "Oliver",
      middleName: "John",
      lastName: "McDonald",
    };
    const payment2 = { sum: 30 };
    const cc2 = {
      number: "0123445329012345",
      cvc: "132",
    };
    const paymentIsOk = await paymentProcess(person, cc, payment);
    const paymentIsOk2 = await paymentProcess(person2, cc2, payment2);

    expect(paymentIsOk).toBe("INVALID_CARD");
    expect(paymentIsOk2).toBe("INVALID_CARD");
  });
});

describe("person", () => {
  it("test invalid person - INVALID PERSON", () => {
    async () => {
      fetch.mockResponseOnce(JSON.stringify({ person: false }));
      fetch.mockResponseOnce(JSON.stringify({ ok: true }));
      const person = {
        firstName: "James",
        middleName: "Roger",
        lastName: "Smith",
      };
      const person2 = {
        firstName: "Oliver",
        middleName: "John",
        lastName: "McDonald",
      };
      const personIsValid = await checkPersonObject(person);
      const personIsValid2 = await checkPersonObject(person2);

      expect(personIsValid).toBe("INVALID_PERSON");
      expect(personIsValid2).toBe("INVALID_PERSON");
    };
  });
});

describe("payment", () => {
  it("test invalid payment - PAYMENT FAILED", () => {
    async () => {
      fetch.mockResponseOnce(JSON.stringify({ payment: false }));
      fetch.mockResponseOnce(JSON.stringify({ ok: true }));
      const payment = { sum: 10 };
      const cc = {
        number: "0123456789012345",
        cvc: "123",
      };
      const payment2 = { sum: 145 };
      const cc2 = {
        number: "5678456789012345",
        cvc: "345",
      };
      const paymentIsOk = await makePayment(cc, payment);
      const paymentIsOk2 = await makePayment(cc2, payment2);

      expect(paymentIsOk).toBe("PAYMENT_FAILED");
      expect(paymentIsOk2).toBe("PAYMENT_FAILED");
    };
  });
});
