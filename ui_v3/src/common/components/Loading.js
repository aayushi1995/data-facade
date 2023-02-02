import loading from "../../assets/images/loading.svg";

const Loading = (props) => (
    <div className="spinner">
        <img src={loading} alt="Loading" {...props}/>
    </div>
);

export default Loading;