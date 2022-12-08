import argparse, sys
import boto3

parser=argparse.ArgumentParser()

parser.add_argument('-e','--env_name', action='append', help='<Required> Set flag', required=True)
parser.add_argument('-t','--image_tag', help='<Required> Set flag', required=True)
args=parser.parse_args()

class ImageConf:
    env_name: str
    endpoint: str
    client_id: str
    image_tag: str

    def __init__(self, env_name, endpoint, client_id, image_tag = None):
        self.env_name = env_name
        self.endpoint = endpoint
        self.client_id = client_id
        self.image_tag = image_tag
    

image_confs = [
    ImageConf(
        env_name="Stage",
        endpoint="stage.datafacade.io",
        client_id="coI8Q8LGjdCRqDe6XkE82CmZNcOKOHL1"
    ),
    ImageConf(
        env_name="Prod",
        endpoint="datafacade.io",
        client_id="jRiHIABIhr6YvGhGd5pBDUEntuugritH"
    )
]

print(args.env_name)

for env_name in args.env_name:
    filtered_image_confs = list(filter(lambda x: x.env_name==env_name, image_confs))
    if len(filtered_image_confs) == 1:
        image_conf = filtered_image_confs[0]
        image_tag = image_conf.image_tag if image_conf.image_tag is not None else f"{image_conf.env_name}_{args.image_tag}"
        script = f"""
sudo docker build --build-arg endpoint={image_conf.endpoint} --build-arg client_id={image_conf.client_id} -t df-uiapp:{image_tag} . -f Dockerfile
sudo docker tag df-uiapp:{image_tag} $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/df-uiapp:{image_tag}
sudo docker push $(AWS_ACCOUNT_ID).dkr.ecr.$(AWS_REGION).amazonaws.com/df-uiapp:{image_tag} 
"""
        print(f'echo  " {script} "')
        print(script)
    elif len(filtered_image_confs) > 1:
        raise ValueError(f"Multiple Image Confs found for env_name {env_name}")
    else:
        raise ValueError(f"No Image Conf found for env_name {env_name}")