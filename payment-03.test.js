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

    expect(paymentIsOk).toBe(true);
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
    const paymentIsOk = await paymentProcess(person, cc, payment);

    expect(paymentIsOk).toBe("INVALID_CARD");
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
      const personIsValid = await checkPersonObject(person);

      expect(personIsValid).toBe("INVALID_PERSON");
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
      const paymentIsOk = await makePayment(cc, payment);

      expect(paymentIsOk).toBe("PAYMENT_FAILED");
    };
  });
});
