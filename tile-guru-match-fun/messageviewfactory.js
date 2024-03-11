/**
 * Created by Andrey Popov on 9/20/21.
 */

var MessageViewFactory = {};

MessageViewFactory.create = function (message) {
    switch (message.type) {
        case ChatMessage.MESSAGE_TYPE.SERVICE:
            return new ServiceMessageView(message);
            break;
        case ChatMessage.MESSAGE_TYPE.SEPARATOR:
            return new MessageSeparatorView(message);
            break;
        case ChatMessage.MESSAGE_TYPE.CATEGORIES:
            return new CategoriesView(message);
            break;
        default:
            return new ChatMessageView(message);
            break;
    }
};