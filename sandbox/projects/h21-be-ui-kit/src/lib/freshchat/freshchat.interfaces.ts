export interface IFreshChatInitOptions {
  host: string;
  token: string;
  restoreId?: string;
  externalId?: string;
  config?: IFreshChatConfig;
}

export interface IFreshChatConfig {
  disableEvents?: boolean;
  cssNames?: {
    widget?: string;
    open?: string;
    expanded?: string;
  };
  showFAQOnOpen?: boolean;
  hideFAQ?: boolean;
  agent?: {
    hideName?: boolean;
    hidePic?: boolean;
    hideBio?: boolean;
  };
  headerProperty?: {
    appName?: string;
    appLogo?: string;
    backgroundColor?: string;
    foregroundColor?: string;
    backgroundImage?: string;
    direction?: string;
    hideChatButton?: boolean;
  };
  content?: {
    placeholders?: {
      search_field?: string;
      reply_field?: string;
      csat_reply?: string;
    };
    actions?: {
      csat_yes?: string;
      csat_no?: string;
      push_notify_yes?: string;
      push_notify_no?: string;
      tab_faq?: string;
      tab_chat?: string;
      csat_submit?: string;
    };
    headers?: {
      chat?: string;
      chat_help?: string;
      faq?: string;
      faq_help?: string;
      faq_not_available?: string;
      faq_search_not_available?: string;
      faq_useful?: string;
      faq_thankyou?: string;
      faq_message_us?: string;
      push_notification?: string;
      csat_question?: string;
      csat_yes_question?: string;
      csat_no_question?: string;
      csat_thankyou?: string;
      csat_rate_here?: string;
      channel_response?: {
        offline?: string;
        online?: {
          minutes?: {
            one?: string;
            more?: string;
          };
          hours?: {
            one?: string;
            more?: string;
          };
        };
      };
    };
  };
}

export interface IFreshChatOpenOptions {
  name?: string;
  chanelId?: string;
}

export interface IFreshChatUserProperties {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  phoneCountry?: string;
}
