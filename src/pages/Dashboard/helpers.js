import axios from 'axios';
import { get } from 'lodash';
import { IP_CHART_ID, REQUESTS_CHART_ID, TOP_VALUE_CHART_ID, BASE_URL } from './constants';
import moment from 'moment';

export const getDataWithPayload = async (payload, source) => {
    try {
        const response = await axios({
            method: 'GET',
            url: `${BASE_URL}/${source}/_search`,
            params: {
                source: JSON.stringify(payload),
                source_content_type: 'application/json'
            },
            headers: {
                // Authorization: 'Basic ZWxhc3RpYzpWdWhhaWRhbmcxNTdA',
                'Content-Type': 'application/json'
            }
        });
        const successful = get(response, 'data._shards.successful');
        if (successful) {
            const dataAggregations = get(response, 'data.aggregations.0.buckets');
            return dataAggregations;
        }
    } catch (error) {
        console.log('Error', error);
        return [];
    }
}

export const createNewRule = async (data) => {
  try {
    const response = await axios({
      method: 'POST',
      url: `${BASE_URL}/rules`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {rule: data},
    });
    const status = get(response, 'status');
    if (status === 200 || status === 201) {
      return true;
    }
    else return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export const updateRuleId = async (id, data) => {
  try {
    const response = await axios({
      method: 'PUT',
      url: `${BASE_URL}/rule/${id}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {rule: data},
    });
    const status = get(response, 'status');
    if (status === 200 || status === 201) {
      return true;
    }
    else return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export const deleteRuleId = async (id) => {
  try {
    const response = await axios({
      method: 'DELETE',
      url: `${BASE_URL}/rule/${id}`
    });
    const status = get(response, 'status');
    if (status === 200) {
      return true;
    }
    else return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export const getAllRules = async () => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${BASE_URL}/rules`,
    });
    
    const status = get(response, 'status');
    if (status === 200) {
      return {
        data: response.data,
        isSuccess: true,
      };
    }
    else return {
      data: null,
      isSuccess: false
    };
  } catch (error) {
    console.error(error);
    return {
      data: null,
      isSuccess: false
    };
  }
}

export const getNotifications = async () => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${BASE_URL}/notis`,
    });
    
    const status = get(response, 'status');
    if (status === 200) {
      return {
        data: response.data,
        isSuccess: true,
      };
    } else return {
      data: null,
      isSuccess: false
    };
  } catch (error) {
    return {
      data: null,
      isSuccess: false,
    }
  }
}

export const resolveProblem = async (data) => {
  const dataWithoutId = {...data};
  delete dataWithoutId._id;
  
  try {
    const response = await axios({
      method: 'PUT',
      url: `${BASE_URL}/noti/${data._id.$oid}`,
      data: {noti: dataWithoutId}
    })
    
    const status = get(response, 'status');
    if (status === 200 || status === 201) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

export const getDataFromChartApi = async (endpoint, fromDate, toDate, host) => {
  const fromDateFormatted = moment(fromDate).toISOString();
  const toDateFormatted = moment(toDate).toISOString();
  
  try {
    const response = await axios({
      method: 'POST',
      url: `${BASE_URL}/chart/${endpoint}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        chart: {
          from: fromDateFormatted,
          to: toDateFormatted,
          host,
        }
      }
    })
    
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export const generatePayloadApi = (fromDate, toDate, type) => {
    const fromDateFormatted = moment(fromDate).toISOString();
    const toDateFormatted = moment(toDate).toISOString();
    console.log({fromDate, fromDateFormatted, toDate, toDateFormatted});
    
    switch (type) {
        case REQUESTS_CHART_ID:
            return {
              "aggs": {
                "0": {
                  "date_histogram": {
                    "field": "@timestamp",
                    "fixed_interval": "1s",
                    "time_zone": "Asia/Ho_Chi_Minh"
                  }
                }
              },
              "size": 0,
              "fields": [
                {
                  "field": "@timestamp",
                  "format": "date_time"
                }
              ],
              "script_fields": {},
              "stored_fields": [
                "*"
              ],
              "runtime_mappings": {},
              "_source": {
                "excludes": []
              },
              "query": {
                "bool": {
                  "must": [],
                  "filter": [
                    {
                      "range": {
                        "@timestamp": {
                          "format": "strict_date_optional_time",
                          "gte": fromDateFormatted,
                          "lte": toDateFormatted
                        }
                      }
                    }
                  ],
                  "should": [],
                  "must_not": []
                }
              }
            }
        case IP_CHART_ID:
            return {
                "aggs": {
                    "0": {
                      "terms": {
                        "field": "clientip",
                        "order": {
                          "_count": "desc"
                        },
                        "size": 5
                      }
                    }
                  },
                  "size": 0,
                  "fields": [
                    {
                      "field": "@timestamp",
                      "format": "date_time"
                    },
                    {
                      "field": "user_agent.version",
                      "format": "date_time"
                    }
                  ],
                  "script_fields": {},
                  "stored_fields": [
                    "*"
                  ],
                  "runtime_mappings": {},
                  "_source": {
                    "excludes": []
                  },
                  "query": {
                    "bool": {
                      "must": [],
                      "filter": [
                        {
                          "range": {
                            "@timestamp": {
                              "format": "strict_date_optional_time",
                              "gte": fromDateFormatted,
                              "lte": toDateFormatted,
                            }
                          }
                        }
                      ],
                      "should": [],
                      "must_not": []
                    }
                  }
                }
        case TOP_VALUE_CHART_ID:
            return {
                "aggs": {
                  "0": {
                    "terms": {
                      "field": "user_agent.os.name.keyword",
                      "order": {
                        "_count": "desc"
                      },
                      "size": 5
                    }
                  }
                },
                "size": 0,
                "fields": [
                  {
                    "field": "@timestamp",
                    "format": "date_time"
                  },
                  {
                    "field": "user_agent.version",
                    "format": "date_time"
                  }
                ],
                "script_fields": {},
                "stored_fields": [
                  "*"
                ],
                "runtime_mappings": {},
                "_source": {
                  "excludes": []
                },
                "query": {
                  "bool": {
                    "must": [],
                    "filter": [
                      {
                        "range": {
                          "@timestamp": {
                            "format": "strict_date_optional_time",
                            "gte": fromDateFormatted,
                            "lte": toDateFormatted
                          }
                        }
                      }
                    ],
                    "should": [],
                    "must_not": [
                      {
                        "match_phrase": {
                          "user_agent.name.keyword": "IE"
                        }
                      }
                    ]
                  }
                }
              }
        default: 
            return {};
    }
}
