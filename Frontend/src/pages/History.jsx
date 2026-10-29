import React from 'react'
import Container from '../components/Container/Container'
import HistoryErrorTab from '../components/HistoryTab/HistoryErrorTab'
import HistoryTab from '../components/HistoryTab/HistoryTab'
import { useSelector } from 'react-redux'

function History() {

  const historyArray = useSelector(state => state.connection.userHistory)

  return (
    <div className="py-12 sm:py-16">
      <Container>
        {/* all the props are sent to a component bundled in an object which also include children alongside passed props, that is why you can destructure them directly inside component fn*/}
        
        {historyArray.map(content => content.error ? <HistoryErrorTab key={content.error} {...content}/> : <HistoryTab key={content.sessionId} {...content}/>)}
        
      </Container>
      
    </div>
  )
}

export default History
