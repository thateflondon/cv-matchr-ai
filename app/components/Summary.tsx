import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";

const Category = ({ title, score }: { title: string, score: number }) => {
    // Make text color depend of the score
    const textColor = score > 70 ? 'text-green-600' : score > 49 ? 'text-yellow-600' : 'text-red-600';

    return (
        <div className="resume-summary">
            <div className="category">
                <div className="flex flex-row gap-2 items-center justify-center">
                    <p className="max-sm:text-base max-md:text-lg text-xl">{title}</p>
                    <ScoreBadge score={score} />
                </div>
                <p className="max-sm:text-lg max-md:text-xl text-2xl">
                    <span className={textColor}>{score}</span>/100
                </p>
            </div>
        </div>
    )
}

const Summary = ({ feedback }: { feedback: Feedback }) => {
    return (
        <div className="bg-white rounded-2xl shadow-md w-full">
            <div className="flex flex-row max-sm:flex-col items-center p-4 gap-4 sm:gap-8">
                <ScoreGauge score={feedback.overallScore}/>

                <div className="flex flex-col gap-2 max-sm:text-center">
                    <h2 className="max-sm:text-xl max-md:text-2xl text-3xl">Your Resume Score</h2>
                    <p className="max-sm:text-xs text-sm text-gray-500">
                        This score is calculated based on the variables listed below.
                    </p>
                </div>
            </div>
            <Category title="Tone & Style" score={feedback.toneAndStyle.score}/>
            <Category title="Content" score={feedback.content.score}/>
            <Category title="Structure" score={feedback.structure.score}/>
            <Category title="Skills" score={feedback.skills.score}/>
        </div>
    );
};

export default Summary;