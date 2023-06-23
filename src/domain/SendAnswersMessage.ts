type SendAnswersMessage = {
    quizId: string;
    adminId: string;
    // TODO: Refactor to accept more types of answers
    answers: number[];
};

export default SendAnswersMessage;
