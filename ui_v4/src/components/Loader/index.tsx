import { Row ,Col, Spin} from "antd";

const Loader = () => <Row justify="center" align="middle">
    <Col span={4}>
        <Spin size="large" tip="Loading.."/>
    </Col>
</Row>

export default Loader