import React from 'react'
import {
  HistoryTab,
  HistoryErrorTab,
  Container
} from "../components/index.js"
import { useSelector } from 'react-redux'

function History() {

  const historyArrayFromStore = useSelector(state => state.connection.userHistory);

  const historyArray = [ ...(historyArrayFromStore ?? []) ].reverse();


  return (
    <div className="py-12 sm:py-16">
      <Container>
        {historyArray.map(content => content.error ? <HistoryErrorTab key={content.error} {...content}/> : <HistoryTab key={content.sessionId} {...content}/>)}
        
      </Container>
      
    </div>
  )
}

export default History
