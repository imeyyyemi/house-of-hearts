import java.util.List;

// This class represents the structure of the JSON request body
// sent by the client when submitting a quiz.
public class SubmitRequest {

    // The ID of the quiz being submitted.
    private Long quizId;

    // A list of the user's answers.
    private List<Answer> answers;

    // --- Constructors --- (Optional, but good practice)

    public SubmitRequest() {}

    public SubmitRequest(Long quizId, List<Answer> answers) {
        this.quizId = quizId;
        this.answers = answers;
    }

    // --- Getters and Setters (Required for Spring Boot to map JSON) ---

    public Long getQuizId() {
        return quizId;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }

    public List<Answer> getAnswers() {
        return answers;
    }

    public void setAnswers(List<Answer> answers) {
        this.answers = answers;
    }
}