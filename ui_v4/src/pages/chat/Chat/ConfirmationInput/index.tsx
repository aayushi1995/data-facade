import { Button, Typography } from "antd";
import Title from "antd/es/typography/Title";import React from "react";
import { ConfirmationPayloadType } from "../../ChatBlock/ChatBlock.type";



function ConfirmationInput(props: ConfirmationPayloadType) {
    
  const [clicked, setClicked] = React.useState(false)
  // console.log(props)
  const handleConfirm = () => {
      setClicked(true)
      props?.onAccept?.()
    };
  
    const handleCancel = () => {
      setClicked(true)
      props?.onReject?.()
    };
  
    return (
      <div className="confirm-dialog">
          <div className="confirm-dialog-content">
          <Title level={4}>{props?.header}</Title>
          <Typography.Paragraph>{props?.moreinfo}</Typography.Paragraph>
              <Button style={{marginRight:'10px'}} type="primary"  disabled={clicked} ghost onClick={handleConfirm}>Confirm</Button>
              <Button type="primary"  disabled={clicked} onClick={handleCancel}>Cancel</Button>
          </div>
      </div>
    );
  }
export default ConfirmationInput