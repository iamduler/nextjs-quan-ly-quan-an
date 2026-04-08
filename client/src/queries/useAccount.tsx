import accountApiRequest from "@/apiRequests/account"
import { UpdateEmployeeAccountBodyType } from "@/schemaValidations/account.schema"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useAccountMeQuery = () => {
	return useQuery({
		queryKey: ['account-me'],
		queryFn: accountApiRequest.me,
	})
}

export const useUpdateMeMutation = () => {
	return useMutation({
		mutationFn: accountApiRequest.updateMe,
	})
}

export const useChangePasswordMutation = () => {
	return useMutation({
		mutationFn: accountApiRequest.changePassword,
	})
}

export const useGetAccountListQuery = () => {
	return useQuery({
		queryKey: ['accounts'],
		queryFn: accountApiRequest.list,
	})
}

export const useGetAccountQuery = ({ id }: { id: number }) => {
	return useQuery({
		queryKey: ['account', id],
		queryFn: () => accountApiRequest.get(id),
	})
}

export const useAddAccountMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: accountApiRequest.add,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['accounts'] })
		},
	})
}

export const useUpdateAccountMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: ({ id, ...body }: UpdateEmployeeAccountBodyType & { id: number }) => accountApiRequest.update(id, body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['accounts'] })
		},
	})
}

export const useDeleteAccountMutation = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (id: number) => accountApiRequest.delete(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['accounts'] })
		},
	})
}