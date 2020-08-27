import React from 'react'
import { SimpleInvestmentProvider } from "./utils/GlobalState"
import { Grid } from "semantic-ui-react"
import { AlignedContainer, FluidContainer } from "../../SemanticUI/Containers"
import SymbolForm from "./components/Forms/SymbolForm"
import StartDateDropdown from "./components/Dropdowns/StartDateDropdown"
import EndDateDropdown from "./components/Dropdowns/EndDateDropdown"
import InvestmentForm from "./components/Forms/InvestmentForm"
import SimpleInvestment from "../SimpleInvestment"
import ActiveTrading from "../ActiveTrading"
import "./style.css"
import RangeFormBL from '../ActiveTrading/components/Forms/BuyLow/index'
import RangeFormBH from '../ActiveTrading/components/Forms/BuyHigh/index'
import RangeFormSH from '../ActiveTrading/components/Forms/SellHigh/index'
import RangeFormSL from '../ActiveTrading/components/Forms/SellLow/index'


export default function GatherInformation(props) {

    return (
        <SimpleInvestmentProvider>
            <AlignedContainer className="large-container">
                <Grid centered>
                    <Grid.Column width={4}>
                        <SymbolForm />
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <StartDateDropdown />
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <EndDateDropdown />
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <InvestmentForm />
                    </Grid.Column>
                </Grid>
                </AlignedContainer>

                <AlignedContainer className="large-container">
                <Grid centered>
                    <Grid.Column width={4}>
                        <RangeFormBL /> 
                        <RangeFormBH /> 
                        <RangeFormSH /> 
                        <RangeFormSL /> 
                    </Grid.Column>
                </Grid>
                </AlignedContainer>


            {props.pathname === "/" ?  <ActiveTrading /> : null}
             {/* {props.pathname === "/" ?  <SimpleInvestment /> : null} */}
             {/* {props.pathname === "Sam" ? <SamsComponent/> : null} */}
            {/* </AlignedContainer> */}
        </SimpleInvestmentProvider>
    )

}