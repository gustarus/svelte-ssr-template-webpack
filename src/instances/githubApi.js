import axios from 'axios';
import { GITHUB_API_BASE } from './../constants';

const githubApi = axios.create({
  baseURL: GITHUB_API_BASE
});

export default githubApi;
