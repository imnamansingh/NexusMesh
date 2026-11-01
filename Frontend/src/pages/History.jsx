import React from 'react'
import {
  HistoryTab,
  HistoryErrorTab,
  Container
} from "../components/index.js"
import { useSelector } from 'react-redux'

function History() {

  //useSelector() gives you a reference to the array stored in Redux state
  const historyArrayFromStore = useSelector(state => state.connection.userHistory);

  //?? is the nullish coalescing operator. It uses the value on the left unless that value is null or undefined; otherwise, it uses the value on the right. Unlike ||, ?? preserves other falsy values except null and undefined.
  const historyArray = [ ...(historyArrayFromStore ?? []) ].reverse();


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
