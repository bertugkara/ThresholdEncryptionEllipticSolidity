import './CandidateView.css'

const CandidateViewTemplate = (props) => {

    const candidateViewTemplate = () => {
        return props.candidateList.map((candidate, index) => {
            const isSelected = props.selectedCandidate?.id === candidate.id;

            return (
                <div className={isSelected ? "candidate-image clicked" : "candidate-image"} key={index}
                     onClick={() => props.setSelectedCandidate(candidate)}>
                    <img
                        src={candidate.image}
                        width={200}
                        height={200}
                        alt={candidate.name}
                    />
                    <h3>{candidate.name}</h3>
                </div>
            );
        });
    };

    return (
        <div
            style={{
                marginTop: 30,
                justifyContent: "center",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, 200px)",
                gap: 100,
            }}
        >
            {candidateViewTemplate()}
        </div>
    );
};

export default CandidateViewTemplate;
