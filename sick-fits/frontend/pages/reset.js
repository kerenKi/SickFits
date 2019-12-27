import Reset from '../components/Reset';

const ResetPassword = (props) => (
  <div> 
    <p>reset password</p>
    <Reset resetToken={props.query.resetToken}/>
  </div>   
)

export default ResetPassword;