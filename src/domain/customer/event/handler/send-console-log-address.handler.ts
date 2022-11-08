import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerChangeAddressEvent from "../customer-change-address.event";

export default class SendConsoleLogAddressHandler implements EventHandlerInterface<CustomerChangeAddressEvent> {
    handle(event: CustomerChangeAddressEvent) {
        console.log(
            'Endereço do cliente: %s, %s alterado para: %s',
            event.eventData.id,
            event.eventData.name,
            event.eventData.address,
        );
    }
}