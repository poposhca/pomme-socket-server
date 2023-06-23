type ReceiveAnswerMessage = {
    userId: string;
    // TODO: Refactor to accept more types of answers
    answers: number[];
};

export default ReceiveAnswerMessage;
