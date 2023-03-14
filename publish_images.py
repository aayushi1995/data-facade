import argparse
import sys

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
    fds_endpoint: str
    ecr_repo_prefix: str

    def __init__(self, env_name, endpoint, client_id, fds_endpoint, image_tag = None, repo_prefix="df-uiapp"):
        self.env_name = env_name
        self.endpoint = endpoint
        self.client_id = client_id
        self.image_tag = image_tag
        self.fds_endpoint = fds_endpoint
        self.ecr_repo_prefix = repo_prefix
    

image_confs = [
    ImageConf(
        env_name="Stage",
        endpoint="stage.datafacade.io",
        client_id="coI8Q8LGjdCRqDe6XkE82CmZNcOKOHL1",
        fds_endpoint="stage.datafacade.io"
    ),
    ImageConf(
        env_name="Production",
        endpoint="datafacade.io",
        client_id="jRiHIABIhr6YvGhGd5pBDUEntuugritH",
        fds_endpoint="datafacade.io"
    ),
    ImageConf(
        env_name="NextStage",
        endpoint="next.datafacade.io",
        client_id="PSz8fpwsyWaygGsVd0EV1SnS2GEOjN8V",
        fds_endpoint="stage.datafacade.io",
        repo_prefix="df-uiapp-v4",
        image_tag=f"Stage_{args.image_tag}"
    ),
    ImageConf(
        env_name="NextProd",
        endpoint="app.datafacade.io",
        client_id="41G3SgeWWolaLO6AeJ4nOgB3xtJuZEYg",
        fds_endpoint="datafacade.io",
        repo_prefix="df-uiapp-v4",
        image_tag=f"Prod_{args.image_tag}"
    )

]

print(args.env_name)

for env_name in args.env_name:
    filtered_image_confs = list(filter(lambda x: x.env_name==env_name, image_confs))
    if len(filtered_image_confs) == 1:
        image_conf = filtered_image_confs[0]
        image_tag = image_conf.image_tag if image_conf.image_tag is not None else f"{image_conf.env_name}_{args.image_tag}"
        script = f"""
sudo docker build --build-arg endpoint={image_conf.endpoint} --build-arg client_id={image_conf.client_id} --build-arg fds_endpoint={image_conf.fds_endpoint} -t {image_conf.ecr_repo_prefix}:{image_tag} . -f Dockerfile
sudo docker tag {image_conf.ecr_repo_prefix}:{image_tag} ${{AWS_ACCOUNT_ID}}.dkr.ecr.${{AWS_REGION}}.amazonaws.com/{image_conf.ecr_repo_prefix}:{image_tag}
sudo docker push ${{AWS_ACCOUNT_ID}}.dkr.ecr.${{AWS_REGION}}.amazonaws.com/{image_conf.ecr_repo_prefix}:{image_tag} 
"""
        print(f'echo  " {script} "')
        print(script)
    elif len(filtered_image_confs) > 1:
        raise ValueError(f"Multiple Image Confs found for env_name {env_name}")
    else:
        raise ValueError(f"No Image Conf found for env_name {env_name}")