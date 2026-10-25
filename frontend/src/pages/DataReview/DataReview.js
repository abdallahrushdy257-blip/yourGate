import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './DataReview.css'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router'

function DataReview() {
    return (
        <>
            <div className='datareview'>
                <div className='reviewIconcon'>
                <FontAwesomeIcon icon={faUserSecret} className='reviewIcon' />
                </div>
                <h2>يتم مراجعة بياناتك</h2>
                <Link to='/login' className='reviewLogin'>
                    Login
                </Link>


            </div>
        </>
    )
}


export default DataReview