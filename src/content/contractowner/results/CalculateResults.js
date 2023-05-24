import {useState} from "react";
import CalculateResultsView from "./CalculateResultsView";
import {getAllEncryptedVotes, getSubmittedPrivateKeyShares} from "../../../api/VotingOperationsApi";
import {checkPrivateKeysAndDecryptVotes} from "./CheckPrivateKeysAndDecryptVotes";

const columns = [
    {field: 'id', headerName: 'ID', width: 90},
    {field: 'name', headerName: 'Candidate Name', width: 600},
    {field: 'voteCount', headerName: 'Count', width: 400}
];

const CalculateResults = () => {

    const [isCalculateResultsClicked, setIsCalculateResultsClicked] = useState(false);
    const [results, setResults] = useState([]);

    const handleCalculateResultsClicked = async () => {
        const allEncryptedVotes = await getAllEncryptedVotes();
        const submittedPrivateKeyShares = await getSubmittedPrivateKeyShares();
        let resultTemplate = await checkPrivateKeysAndDecryptVotes(allEncryptedVotes, submittedPrivateKeyShares);
        console.log(resultTemplate);
        setResults(resultTemplate);
        setIsCalculateResultsClicked(true);
    }

    return <div>
        {isCalculateResultsClicked ? <div>
            <h1>Results</h1>
            <CalculateResultsView columns={columns} rows={results}/>
        </div> : <div>
            <bl-button style={{marginTop: 30}} kind="success" onClick={handleCalculateResultsClicked}>Calculate
                Results
            </bl-button>
            <br/>
        </div>}
        {isCalculateResultsClicked &&
            <bl-button style={{marginTop: 30}} kind="success" onClick={() => setIsCalculateResultsClicked(false)}> Go
                Back
            </bl-button>}
    </div>
}

export default CalculateResults;