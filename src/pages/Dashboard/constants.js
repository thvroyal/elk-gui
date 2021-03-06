export const REQUESTS_CHART_ID = 1;
export const IP_CHART_ID = 2;
export const TOP_VALUE_CHART_ID = 3;

export const REQUEST_THRESHOLD_DEFAULT = 100;

export const LOG_FILES = [
    'fake_log',
    'filebeat-*',
    'filebeat-7.16.2-2021.12.26-000001',
];

export const BASE_URL = 'http://192.168.2.11:5000';

export const fieldLabelMap = {
  'nginx.access.url': 'URL Pattern',
  'nginx.access.remote_ip': 'Remote IP',
  'process.name': 'Process',
  'destination.ip': 'Destination IP',
  'user.name': 'Actor',
  'file.path': 'File Path',
};