import {Card, CardContent, Typography} from "@mui/material";

const TxConclusionTemplate = (props) => {

    const txResult = props.txResult;

    return <Card sx={{minWidth: 750, maxWidth: 1000, margin: 'auto'}}>
        <CardContent>
            <Typography variant="h5" component="h2">
                Transaction Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
                <strong>Transaction Hash:</strong> {txResult.hash}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                <strong>Sender Address:</strong> {txResult.from}
            </Typography>
        </CardContent>
    </Card>

}

export default TxConclusionTemplate;