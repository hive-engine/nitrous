import React, { Component } from 'react';
import { connect } from 'react-redux';
import reactForm from 'app/utils/ReactForm';
import { SUBMIT_FORM_ID } from 'shared/constants';
import tt from 'counterpart';
import { fromJS } from 'immutable';
import BeneficiarySelector, {
    validateBeneficiaries,
} from 'app/components/cards/BeneficiarySelector';
import PostTemplateSelector from 'app/components/cards/PostTemplateSelector';
import { loadUserTemplates, saveUserTemplates } from 'app/utils/UserTemplates';

import * as userActions from 'app/redux/UserReducer';

class PostAdvancedSettings extends Component {
    static propTypes = {
        formId: React.PropTypes.string.isRequired,
    };

    constructor(props) {
        super();
        this.state = {
            payoutType: props.initialPayoutType,
            postTemplateName: null,
        };
        this.initForm(props);
    }

    initForm(props) {
        const { fields } = props;
        reactForm({
            fields,
            instance: this,
            name: 'advancedSettings',
            initialValues: props.initialValues,
            validation: values => {
                return {
                    beneficiaries: validateBeneficiaries(
                        props.username,
                        values.beneficiaries,
                        false
                    ),
                };
            },
        });
    }

    handlePayoutChange = event => {
        this.setState({ payoutType: event.target.value });
    };

    handleTemplateSelected = postTemplateName => {
        const { username } = this.props;
        const userTemplates = loadUserTemplates(username);
        this.setState({ postTemplateName });

        if (postTemplateName !== null) {
            for (let ti = 0; ti < userTemplates.length; ti += 1) {
                const template = userTemplates[ti];
                const { beneficiaries } = this.state;
                const newBeneficiaries = {
                    ...beneficiaries,
                };

                if (template.name === postTemplateName) {
                    if (template.hasOwnProperty('payoutType')) {
                        this.setState({ payoutType: template.payoutType });
                    }

                    if (template.hasOwnProperty('beneficiaries')) {
                        newBeneficiaries.props.value = template.beneficiaries;
                        this.setState({ beneficiaries: newBeneficiaries });
                    }

                    break;
                }
            }
        }
    };

    handleDeleteTemplate = (event, postTemplateName) => {
        event.preventDefault();
        event.stopPropagation();

        const { username } = this.props;
        const userTemplates = loadUserTemplates(username);
        let ui = userTemplates.length;
        while (ui--) {
            if (userTemplates[ui].name === postTemplateName) {
                userTemplates.splice(ui, 1);
            }
        }

        saveUserTemplates(username, [...userTemplates]);
        this.setState({ postTemplateName: null });
    };

    render() {
        const {
            formId,
            username,
            defaultPayoutType,
            initialPayoutType,
        } = this.props;
        const { beneficiaries, payoutType, postTemplateName } = this.state;
        const loadingTemplate =
            postTemplateName && postTemplateName.indexOf('create_') === -1;
        const { submitting, valid, handleSubmit } = this.state.advancedSettings;
        const userTemplates = loadUserTemplates(username);
        const disabled =
            submitting ||
            !(
                valid ||
                payoutType !== initialPayoutType ||
                postTemplateName !== null
            );

        const form = (
            <form
                onSubmit={handleSubmit(({ data }) => {
                    const err = validateBeneficiaries(
                        this.props.username,
                        data.beneficiaries,
                        true
                    );
                    if (!err) {
                        this.props.setPayoutType(formId, payoutType);
                        this.props.setBeneficiaries(formId, data.beneficiaries);
                        this.props.setPostTemplateName(
                            formId,
                            postTemplateName
                        );
                        this.props.hideAdvancedSettings();
                    }
                })}
            >
                <div className="row">
                    <div className="column">
                        <h4>
                            {tt(
                                'post_advanced_settings_jsx.payout_option_header'
                            )}
                        </h4>
                        <p>
                            {tt(
                                'post_advanced_settings_jsx.payout_option_description'
                            )}
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="small-12 medium-6 large-12 columns">
                        <select
                            value={payoutType}
                            onChange={this.handlePayoutChange}
                        >
                            <option value="0%">
                                {tt('reply_editor.decline_payout')}
                            </option>
                            <option value="50%">
                                {tt('reply_editor.default_50_50')}
                            </option>
                            <option value="100%">
                                {tt('reply_editor.power_up_100')}
                            </option>
                        </select>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="column">
                        {tt('post_advanced_settings_jsx.current_default')}:{' '}
                        {defaultPayoutType === '0%'
                            ? tt('reply_editor.decline_payout')
                            : defaultPayoutType === '50%'
                              ? tt('reply_editor.default_50_50')
                              : tt('reply_editor.power_up_100')}
                    </div>
                </div>
                <div className="row">
                    <div className="column">
                        <a href={'/@' + username + '/settings'}>
                            {tt(
                                'post_advanced_settings_jsx.update_default_in_settings'
                            )}
                        </a>
                    </div>
                </div>
                <br />
                <div className="row">
                    <h4 className="column">
                        {tt('beneficiary_selector_jsx.header')}
                    </h4>
                </div>
                <BeneficiarySelector {...beneficiaries.props} tabIndex={1} />
                <PostTemplateSelector
                    username={username}
                    onChange={this.handleTemplateSelected}
                    templates={userTemplates}
                />
                <div className="error">
                    {(beneficiaries.touched || beneficiaries.value) &&
                        beneficiaries.error}&nbsp;
                </div>
                <div className="row">
                    <div className="column">
                        <span>
                            <button
                                type="submit"
                                className="button"
                                disabled={disabled}
                                tabIndex={2}
                            >
                                {loadingTemplate &&
                                    tt(
                                        'post_advanced_settings_jsx.load_template'
                                    )}
                                {!loadingTemplate && tt('g.save')}
                            </button>
                            {loadingTemplate && (
                                <button
                                    className="button"
                                    tabIndex={2}
                                    onClick={event => {
                                        this.handleDeleteTemplate(
                                            event,
                                            postTemplateName
                                        );
                                    }}
                                >
                                    {postTemplateName &&
                                        postTemplateName.indexOf('create_') ===
                                            -1 &&
                                        tt(
                                            'post_advanced_settings_jsx.delete_template'
                                        )}
                                </button>
                            )}
                        </span>
                    </div>
                </div>
            </form>
        );
        return (
            <div>
                <div className="row">
                    <h3 className="column">
                        {tt('reply_editor.advanced_settings')}
                    </h3>
                </div>
                <hr />
                {form}
            </div>
        );
    }
}

export default connect(
    // mapStateToProps
    (state, ownProps) => {
        const formId = ownProps.formId;
        const username = state.user.getIn(['current', 'username']);
        const isStory = formId === SUBMIT_FORM_ID;
        const defaultPayoutType = state.app.getIn(
            [
                'user_preferences',
                isStory ? 'defaultBlogPayout' : 'defaultCommentPayout',
            ],
            '50%'
        );
        const initialPayoutType = state.user.getIn([
            'current',
            'post',
            formId,
            'payoutType',
        ]);
        let beneficiaries = state.user.getIn([
            'current',
            'post',
            formId,
            'beneficiaries',
        ]);
        beneficiaries = beneficiaries ? beneficiaries.toJS() : [];
        return {
            ...ownProps,
            fields: ['beneficiaries'],
            defaultPayoutType,
            initialPayoutType,
            username,
            initialValues: { beneficiaries },
        };
    },

    // mapDispatchToProps
    dispatch => ({
        hideAdvancedSettings: () =>
            dispatch(userActions.hidePostAdvancedSettings()),
        setPayoutType: (formId, payoutType) =>
            dispatch(
                userActions.set({
                    key: ['current', 'post', formId, 'payoutType'],
                    value: payoutType,
                })
            ),
        setBeneficiaries: (formId, beneficiaries) =>
            dispatch(
                userActions.set({
                    key: ['current', 'post', formId, 'beneficiaries'],
                    value: fromJS(beneficiaries),
                })
            ),
        setPostTemplateName: (formId, postTemplateName, create = false) =>
            dispatch(
                userActions.set({
                    key: ['current', 'post', formId, 'postTemplateName'],
                    value: create
                        ? `create_${postTemplateName}`
                        : postTemplateName,
                })
            ),
    })
)(PostAdvancedSettings);
