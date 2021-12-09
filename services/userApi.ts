import { AxiosPromise } from "axios";
import BaseAPIServices from "./BaseAPIServices";

/**
 * Give a new user access to a vsm
 * @param newUser
 */
export const add = (newUser: {
  user: string;
  vsmId: number;
  role: string;
}): AxiosPromise =>
  BaseAPIServices.post(`/api/v1.0/userAccess`, newUser).then(
    (value) => value.data
  );

/**
 * Update access for a user
 * @param props
 */
export const update = (props: {
  user: { accessId: number };
  role: string;
}): AxiosPromise =>
  BaseAPIServices.patch(`/api/v1.0/userAccess`, {
    accessId: props.user.accessId,
    role: props.role,
  });

/**
 * Remove access from a user.
 * @param props
 */
export const remove = (props: {
  accessId: string;
  vsmId: number;
}): AxiosPromise =>
  BaseAPIServices.delete(
    `/api/v1.0/userAccess/${props.vsmId}/${props.accessId}`
  );

/**
 * Gets the access for the specified user in the specified Vsm
 * @param props
 */
export const get = async ({
  vsmId,
  userName,
}: {
  vsmId: number;
  userName: string;
}): Promise<unknown> => {
  const res = await BaseAPIServices.get(
    `/api/v1.0/userAccess/${vsmId}/${userName}`
  );
  return res.data;
};
