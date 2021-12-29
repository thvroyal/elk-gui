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
