import { Navbar,Container,Image,Button } from 'react-bootstrap';
import { IoMdAddCircle } from "react-icons/io";
import Menu from './Menu.js';
import { useNavigate } from 'react-router-dom';

function Criteria(){
    const navigate = useNavigate();
    const question = () =>{
        navigate("/home");
    }

    return(
        <>
            <Navbar className='p-3 nav-bottom'>
                <Container className='d-flex justify-content-center'>
                    <Image src='assessmate.png' alt='' className='question-image'/>
                </Container>
            </Navbar>
            <Container>
                <div className='d-flex justify-content-end me-1 mt-4'>
                    <Button className='bttn rounded-pill fw-bold p-2 fs-5'>
                        <IoMdAddCircle size={20} className='mb-1 p-0'/>
                        &nbsp;Add Criteria
                    </Button>
                </div>
            </Container>

            <div className='mt-3' style={{ overflowY: 'scroll', maxHeight: '490px' }}>
                <Container></Container>
            </div>

            <Menu />
        </>
    );
}

export default Criteria;