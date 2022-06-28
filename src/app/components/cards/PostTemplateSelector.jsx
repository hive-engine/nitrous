import React from 'react';
import tt from 'counterpart';

class PostTemplateSelector extends React.Component {
    static propTypes = {
        username: React.PropTypes.string.isRequired,
        templates: React.PropTypes.array.isRequired,
        onChange: React.PropTypes.func.isRequired,
    };

    constructor() {
        super();
        this.state = {
            currentTemplateName: '',
        };
    }

    render() {
        const { username, onChange, templates } = this.props;
        const { currentTemplateName } = this.state;
        if (!username || typeof window === 'undefined') {
            return null;
        }

        const handleTemplateSelection = (event, create = false) => {
            const selectedTemplateName = event.target.value;
            this.setState({ currentTemplateName: selectedTemplateName });
            onChange(
                create ? `create_${selectedTemplateName}` : selectedTemplateName
            );
        };

        return (
            <div>
                <div className="row">
                    <div className="column">
                        <h4>{tt('post_template_selector_jsx.templates')}</h4>
                        <p>
                            {tt(
                                'post_template_selector_jsx.templates_description'
                            )}
                        </p>
                    </div>
                </div>
                <div className="row">
                    <div className="small-12 medium-6 large-12 columns">
                        {templates && (
                            <select
                                onChange={handleTemplateSelection}
                                value={currentTemplateName}
                            >
                                <option value="">
                                    {tt(
                                        'post_template_selector_jsx.choose_template'
                                    )}
                                </option>
                                {templates.map(template => (
                                    <option
                                        value={template.name}
                                        key={template.name}
                                    >
                                        {template.name}
                                    </option>
                                ))}
                            </select>
                        )}
                        {!templates && (
                            <span>
                                {tt(
                                    'post_template_selector_jsx.create_template_first'
                                )}
                            </span>
                        )}
                    </div>
                </div>
                <div className="row">
                    <div className="small-12 medium-6 large-12 columns">
                        <input
                            id="new_template_name"
                            type="text"
                            className="input-group-field bold"
                            placeholder={tt(
                                'post_template_selector_jsx.new_template_name'
                            )}
                            onChange={event => {
                                handleTemplateSelection(event, true);
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default PostTemplateSelector;
