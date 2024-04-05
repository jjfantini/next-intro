import { revalidatePath } from "next/cache";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

function AnswerInput({ id }: { id: number }) {
  return (
    <label>
      Answer {id}:
      <input className="border-2 border-gray-300 rounded-md px-2 py-1 bg-gray-100" type="text" name={`answer-${id}`}/>
      <input type="checkbox" name={`check-${id}`} />
    </label>
  );
}

export default function QuizForm() {
  async function createQuiz(formData: FormData) {
    "use server";
    let title = formData.get('title') as string;
    let description = formData.get('description') as string;
    let question = formData.get('question') as string;
    let answers = [1, 2].map((id) => {
      return {
        answer: formData.get(`answer-${id}`) as string,
        isCorrect: formData.get(`check-${id}`) === 'on',
      };
    });

    await sql`
      WITH new_quiz AS (
        INSERT INTO quizzes (title, description, question_text, created_at)
        VALUES (${title}, ${description}, ${question}, NOW())
        RETURNING quiz_id
      )
      INSERT INTO answers (quiz_id, answer_text, is_correct)
      VALUES
        ((SELECT quiz_id FROM new_quiz), ${answers[0].answer}, ${answers[0].isCorrect}),
        ((SELECT quiz_id FROM new_quiz), ${answers[1].answer}, ${answers[1].isCorrect});
    `;

    revalidatePath('/');
  }

  return (
    <form className="flex flex-col mt-8" action={createQuiz}>
      <h3 className="text-2xl font-bold">Create Quiz</h3>
      <label>
        Title
        <input className="border-2 border-gray-300 rounded-md px-2 py-1 bg-gray-100" type="text" name="title"/>
      </label>
      <label>
        Description
        <input className="border-2 border-gray-300 rounded-md px-2 py-1 bg-gray-100" type="text" name="description"/>
      </label>
      <label>
        Question
        <input className="border-2 border-gray-300 rounded-md px-2 py-1 bg-gray-100" type="text" name="question"/>
      </label>
      <hr className="my-4" />
      <AnswerInput id={1} />
      <AnswerInput id={2} />
      <button type='submit' className="bg-blue-500 text-white rounded p-2 m-2 hover:bg-blue-600 transition-all">
        Add Quiz
      </button>
    </form>
  );
}

