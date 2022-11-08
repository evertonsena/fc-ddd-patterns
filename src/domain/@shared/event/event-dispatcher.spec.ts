import Customer from "../../customer/entity/customer";
import CustomerChangeAddressEvent from "../../customer/event/customer-change-address.event";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import SendConsoleLogAddressHandler from "../../customer/event/handler/send-console-log-address.handler";
import SendConsoleLogOneHandler from "../../customer/event/handler/send-console-log-one.handler copy";
import SendConsoleLogTwoHandler from "../../customer/event/handler/send-console-log-two.handler";
import Address from "../../customer/value-object/address";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });

  it("should notify all event handlers of CustomerCreatedEvent", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandlerLog1 = new SendConsoleLogOneHandler();
    const eventHandlerLog2 = new SendConsoleLogTwoHandler();

    const spyEventHandlerLog1 = jest.spyOn(eventHandlerLog1, "handle");
    const spyEventHandlerLog2 = jest.spyOn(eventHandlerLog2, "handle");

    eventDispatcher.register("CustomerCreatedEvent", eventHandlerLog1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandlerLog2);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandlerLog1);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(eventHandlerLog2);    

    const customerCreatedEvent = new CustomerCreatedEvent({
      name: "Customer name",
    });

    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandlerLog1).toHaveBeenCalled();
    expect(spyEventHandlerLog2).toHaveBeenCalled();
  })

  it("should notify all event handlers of CustomerChangeAddressEvent", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandlerLog = new SendConsoleLogAddressHandler();

    const spyEventHandlerLog = jest.spyOn(eventHandlerLog, "handle");

    eventDispatcher.register("CustomerChangeAddressEvent", eventHandlerLog);
    expect(
      eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"][0]
    ).toMatchObject(eventHandlerLog);  
    
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 123, "13330-250", "São Paulo");
    customer.Address = address;

    const customerChangeAddressEvent = new CustomerChangeAddressEvent({
      id: customer.id,
      name: customer.name,
      address: customer.Address
    });    

    eventDispatcher.notify(customerChangeAddressEvent);

    expect(spyEventHandlerLog).toHaveBeenCalled();
  });
});
