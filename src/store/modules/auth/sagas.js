import { takeLatest, call, put, all } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import api from '../../../services/api';
import history from '../../../services/history';
import { signInSuccess, signFailure } from './actions';

export function* signIn({ payload }) {
    try {
        const { email, password } = payload;
        const response = yield call(api.post, 'sessions', {
            email,
            password,
        });

        const { token, user } = response.data;

        if (!user.establishment) {
            toast.error(
                'Usuario nao é prestador de um estabelecimento comercial'
            );
            return;
        }

        yield put(signInSuccess(token, user));

        history.push('/dashboard');
    } catch (err) {
        toast.error('Falha na autenticação, verifique seu email/senha');
        yield put(signFailure());
    }
}

export default all([takeLatest('@auth/SIGN_IN_REQUEST', signIn)]);
