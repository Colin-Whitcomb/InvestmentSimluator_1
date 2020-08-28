import React, { useState } from 'react'
import { useActiveTradingContext } from "./utils/ActiveState"
import Helper from "./utils/Helper"
import { SET_PARAMS, CLEAR_DATA } from "./utils/activeAction"
import { SET_SIMULATION_DATA } from '../GatherInformation/utils/action'
import API from '../../utils/API'
import { Segment, Input, Button, Container } from 'semantic-ui-react'
import { useInformationContext } from '../GatherInformation/utils/InformationState'
import Loader from '../../components/Loader/index'
import ChartHandler from '../../components/ChartHandler'
import './style.css'
import AccordionExample from '../../components/AccordinanActive'


export default function AllForm() {

    console.log(useActiveTradingContext());

    const [informationState, informationDispatch] = useInformationContext();
    const [state, dispatch] = useActiveTradingContext();
    const [buyLow, setBuylow] = useState();
    const [buyHigh, setBuyhigh] = useState();
    const [sellLow, setSelllow] = useState();
    const [sellHigh, setSellhigh] = useState();

    const validator = () => {
        if ((Helper.verifyDrop(sellLow)) && (Helper.verifyDrop(buyLow)) && (Helper.verifyIncrease(buyHigh)) && (Helper.verifyIncrease(sellHigh))) {
            return true
        } return false
    }

    const handleSubmit = event => {

        if (!buyLow && !buyHigh && !sellLow && !sellHigh){
            alert('Inputs must be filled in before simulation runs again.')
        }
    
        dispatch({ type: SET_PARAMS, buyLow: buyLow, buyHigh: buyHigh, sellLow: sellLow, sellHigh: sellHigh })
        // API call 

        const startDate = Helper.findFirstDateInYear(informationState.history, informationState.startYear)
        const endDate = Helper.findLastDateInYear(informationState.history)

        // start, end, symbol, BL, BH, SL, SH
        API.runActiveTrading(startDate, endDate, informationState.symbol, buyLow, buyHigh, sellLow, sellHigh)
            // check this. 
            .then(res => {
                API.runMultipleSimulations([
                    [informationState.symbol, startDate, endDate, informationState.investment, "activeTrading", [res]],
                    [informationState.symbol, startDate, endDate, informationState.investment, "buyAndWait", []],

                ])
                    .then(res => {
                        console.log(res)
                        informationDispatch({ type: SET_SIMULATION_DATA, data: res })
                        setBuyhigh("")
                        setBuylow("")
                        setSellhigh("")
                        setSelllow("")
                    })
            })
        //

        // setState .... 
    }

    if (!informationState.informationGathered) {
        return null;
    } else if (!state.buyLow) {




        return (

            <Container fluid textAlign="center">
                <Segment fluid>
                    <AccordionExample />
                </Segment>

                <Segment fluid>
                    <p>
                        Buy Low: {"    "}
                        <span>
                            <Input size="mini" placeholder="buy low" value={buyLow} onChange={(event, { value }) => setBuylow(value)} />
                        </span>
                    </p>
                    <p>
                        Buy High {"    "}
                        <span>
                            <Input size="mini" placeholder="buy high" value={buyHigh} onChange={(event, { value }) => setBuyhigh(value)} />
                        </span>
                    </p>
                    <p>
                        Sell Low: {"    "}
                        <span>
                            <Input size="mini" placeholder="sell low" value={sellLow} onChange={(event, { value }) => setSelllow(value)} />
                        </span>
                    </p>
                    <p>
                        Sell High: {"    "}
                        <span>
                            <Input size="mini" placeholder="sell high" value={sellHigh} onChange={(event, { value }) => setSellhigh(value)} />
                        </span>
                    </p>

                    <br></br>
                    <br></br>
                </Segment>

                {validator() ? <Segment className="validBtn"><Button onClick={handleSubmit}>Run Simulation</Button></Segment> : null}



            </Container>

        )
    }

    else {
        return (
            <Container fluid textAlign="center">
                {!informationState.simulationData ? <Loader /> : <ChartHandler simulations={informationState.simulationData} labels={[informationState.symbol + " Active Strat", "Buy And Wait"]} />}
                <br></br>
                <br></br>
                {!informationState.simulationData ? null : <Button primary onClick={() => dispatch({ type: CLEAR_DATA })}>Run New Simulation</Button>}
            </Container>
        )
    }



}